import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { DOCUMENT_LIST } from '../data/modules';
import { DocumentType, InstituteAgreementData } from '../types';

/**
 * Converts Oklab coordinates to rgb/rgba
 */
function oklabToRgb(L: number, a: number, b: number, alpha: number = 1): string {
  // Normalize L if passed as percentage (>1)
  if (L > 1) L = L / 100;

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const toSrgb = (c: number) => {
    if (isNaN(c) || c <= 0) return 0;
    if (c >= 1) return 255;
    if (c <= 0.0031308) return Math.round(12.92 * c * 255);
    return Math.round((1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255);
  };

  const r = toSrgb(r_lin);
  const g = toSrgb(g_lin);
  const bVal = toSrgb(b_lin);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bVal}, ${Number(alpha.toFixed(3))})`;
  }
  return `rgb(${r}, ${g}, ${bVal})`;
}

/**
 * Converts Oklch coordinates to rgb/rgba
 */
function oklchToRgb(L: number, C: number, H: number, alpha: number = 1): string {
  const rad = ((isNaN(H) ? 0 : H) * Math.PI) / 180;
  const a = (isNaN(C) ? 0 : C) * Math.cos(rad);
  const b = (isNaN(C) ? 0 : C) * Math.sin(rad);
  return oklabToRgb(L, a, b, alpha);
}

/**
 * Parses color arguments string from inside oklch(...) or oklab(...)
 */
function parseColorArgs(argsStr: string): { values: number[]; alpha: number } {
  let mainStr = argsStr.trim();
  let alpha = 1;

  if (mainStr.includes('/')) {
    const parts = mainStr.split('/');
    mainStr = parts[0].trim();
    const alphaStr = parts[1].trim();
    if (alphaStr.endsWith('%')) {
      alpha = parseFloat(alphaStr) / 100;
    } else {
      alpha = parseFloat(alphaStr);
    }
  }

  const rawTokens = mainStr.split(/[\s,]+/);
  const values: number[] = [];

  for (const tok of rawTokens) {
    if (!tok) continue;
    const valStr = tok.replace('deg', '');
    let num: number;
    if (valStr.endsWith('%')) {
      num = parseFloat(valStr) / 100;
    } else {
      num = parseFloat(valStr);
    }
    if (!isNaN(num)) {
      values.push(num);
    }
  }

  return { values, alpha: isNaN(alpha) ? 1 : alpha };
}

/**
 * Converts any modern color function match to a safe rgb/rgba string
 */
function convertModernColorToRgb(fullFuncStr: string): string {
  try {
    const match = /^(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\((.+)\)$/i.exec(fullFuncStr.trim());
    if (!match) return 'rgb(0, 0, 0)';

    const fnName = match[1].toLowerCase();
    const argsStr = match[2];

    if (fnName === 'light-dark') {
      const parts = argsStr.split(',');
      if (parts[0]) {
        const firstColor = parts[0].trim();
        if (/(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(firstColor)) {
          return replaceModernColorsInString(firstColor);
        }
        return firstColor;
      }
      return 'rgb(0, 0, 0)';
    }

    const { values, alpha } = parseColorArgs(argsStr);

    if (fnName === 'oklch') {
      const L = values[0] ?? 0;
      const C = values[1] ?? 0;
      const H = values[2] ?? 0;
      return oklchToRgb(L, C, H, alpha);
    }

    if (fnName === 'oklab') {
      const L = values[0] ?? 0;
      const a = values[1] ?? 0;
      const b = values[2] ?? 0;
      return oklabToRgb(L, a, b, alpha);
    }

    if (fnName === 'lch') {
      const L = (values[0] ?? 0) / 100;
      const C = (values[1] ?? 0) / 150;
      const H = values[2] ?? 0;
      return oklchToRgb(L, C, H, alpha);
    }

    if (fnName === 'lab') {
      const L = (values[0] ?? 0) / 100;
      const a = (values[1] ?? 0) / 128;
      const b = (values[2] ?? 0) / 128;
      return oklabToRgb(L, a, b, alpha);
    }

    if (fnName === 'color') {
      const r = Math.min(255, Math.max(0, Math.round((values[0] ?? 0) * 255)));
      const g = Math.min(255, Math.max(0, Math.round((values[1] ?? 0) * 255)));
      const b = Math.min(255, Math.max(0, Math.round((values[2] ?? 0) * 255)));
      if (alpha < 1) {
        return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (alpha < 1) {
      return `rgba(0, 0, 0, ${alpha})`;
    }
    return 'rgb(0, 0, 0)';
  } catch {
    return 'rgb(0, 0, 0)';
  }
}

/**
 * Replaces modern CSS color functions (oklch, oklab, lab, lch, color, light-dark, color-mix) with standard rgb/rgba
 */
export function replaceModernColorsInString(str: string): string {
  if (!str) return str;
  const startRegex = /(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/gi;
  let result = str;
  let match;
  let safetyCounter = 0;

  while ((match = startRegex.exec(result)) !== null && safetyCounter < 1000) {
    safetyCounter++;
    const startIndex = match.index;
    let openCount = 0;
    let endIndex = -1;
    for (let i = startIndex; i < result.length; i++) {
      if (result[i] === '(') openCount++;
      else if (result[i] === ')') {
        openCount--;
        if (openCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
    if (endIndex !== -1) {
      const fullMatch = result.substring(startIndex, endIndex + 1);
      const converted = convertModernColorToRgb(fullMatch);
      result = result.substring(0, startIndex) + converted + result.substring(endIndex + 1);
      startRegex.lastIndex = 0;
    } else {
      break;
    }
  }
  return result;
}

/**
 * Patches window.getComputedStyle on a Window object safely without breaking DOM receiver binding
 */
function patchWindowComputedStyle(win: Window) {
  if (!win || (win as any).__oklab_patched) return;
  (win as any).__oklab_patched = true;

  try {
    const origGetComputedStyle = win.getComputedStyle.bind(win);
    win.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
      const style = origGetComputedStyle(elt, pseudoElt);
      if (!style) return style;

      return new Proxy(style, {
        get(target: CSSStyleDeclaration, prop: string | symbol) {
          if (prop === 'getPropertyValue') {
            return function (propertyName: string) {
              const val = target.getPropertyValue(propertyName);
              if (val && typeof val === 'string' && /(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(val)) {
                return replaceModernColorsInString(val);
              }
              return val;
            };
          }

          // Use target as receiver so native DOM getters run with the real CSSStyleDeclaration instance, avoiding "Illegal invocation"
          let val: any;
          try {
            val = Reflect.get(target, prop, target);
          } catch {
            val = (target as any)[prop];
          }

          if (typeof val === 'function') {
            return val.bind(target);
          }
          if (typeof val === 'string' && /(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(val)) {
            return replaceModernColorsInString(val);
          }
          return val;
        }
      });
    };
  } catch {
    // ignore
  }
}

// Global auto-patch on window initialization
if (typeof window !== 'undefined') {
  patchWindowComputedStyle(window);
}

/**
 * Sanitizes cloned document for html2canvas by replacing unsupported oklch/modern colors in stylesheets, inline styles, and getComputedStyle
 */
async function sanitizeClonedDocForHtml2Canvas(clonedDoc: Document) {
  // 0. Intercept getComputedStyle and CSSStyleDeclaration on cloned window
  if (clonedDoc.defaultView) {
    patchWindowComputedStyle(clonedDoc.defaultView);
  }

  // 1. Fetch, sanitize and convert all <link rel="stylesheet"> elements to <style> tags
  const linkEls = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
  for (const link of linkEls) {
    try {
      const href = link.getAttribute('href');
      if (href) {
        const response = await fetch(href);
        if (response.ok) {
          const cssText = await response.text();
          const sanitizedCss = replaceModernColorsInString(cssText);
          const styleEl = clonedDoc.createElement('style');
          styleEl.textContent = sanitizedCss;
          clonedDoc.head.appendChild(styleEl);
          link.remove();
        }
      }
    } catch {
      // ignore network fetch failures in clone
    }
  }

  // 2. Sanitize all <style> elements
  const styleEls = Array.from(clonedDoc.querySelectorAll('style'));
  styleEls.forEach((styleEl) => {
    if (styleEl.textContent) {
      styleEl.textContent = replaceModernColorsInString(styleEl.textContent);
    }
  });

  // 3. Sanitize styleSheet rules if available
  try {
    const sheets = Array.from(clonedDoc.styleSheets);
    for (const sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i] as CSSStyleRule;
            if (rule.style && rule.style.cssText) {
              if (/(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(rule.style.cssText)) {
                rule.style.cssText = replaceModernColorsInString(rule.style.cssText);
              }
            }
          }
        }
      } catch {
        // Ignore cross-origin stylesheet access
      }
    }
  } catch {
    // ignore
  }

  // 4. Sanitize inline style attributes and style properties on all DOM elements
  const allElements = Array.from(clonedDoc.querySelectorAll('*'));
  allElements.forEach((node) => {
    const el = node as HTMLElement;
    if (el.style && el.style.cssText) {
      if (/(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(el.style.cssText)) {
        el.style.cssText = replaceModernColorsInString(el.style.cssText);
      }
    }
    const styleAttr = el.getAttribute('style');
    if (styleAttr && /(oklch|oklab|lab|lch|color|color-mix|light-dark)\s*\(/i.test(styleAttr)) {
      el.setAttribute('style', replaceModernColorsInString(styleAttr));
    }
  });
}

/**
 * Downloads a single document element as a high quality PDF
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string,
  paperFormat: 'legal' | 'a4' = 'a4'
): Promise<Blob> {
  if (typeof window !== 'undefined') {
    patchWindowComputedStyle(window);
  }

  // Wait for web fonts to load completely if possible
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading errors
    }
  }

  const docId = element.getAttribute('data-pdf-container');

  // Capture HTML element as Canvas with high scale
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 850,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    onclone: async (clonedDoc) => {
      if (clonedDoc.defaultView) {
        patchWindowComputedStyle(clonedDoc.defaultView);
      }

      // 1. Reset body and html margins inside cloned document
      if (clonedDoc.body) {
        clonedDoc.body.style.margin = '0';
        clonedDoc.body.style.padding = '0';
        clonedDoc.body.style.backgroundColor = '#ffffff';
        clonedDoc.body.style.overflow = 'visible';
      }

      // 2. Find target element in cloned document
      let targetInClone: HTMLElement | null = null;
      if (docId) {
        targetInClone = clonedDoc.querySelector(`[data-pdf-container="${docId}"]`);
      }
      if (!targetInClone) {
        targetInClone = clonedDoc.querySelector('.printable-document');
      }

      if (targetInClone) {
        // Hide all sibling elements up the DOM tree to isolate targetInClone at top (0,0)
        let parent = targetInClone.parentElement;
        let child: HTMLElement = targetInClone;

        while (parent && parent !== clonedDoc.body) {
          Array.from(parent.children).forEach((sibling) => {
            if (sibling !== child) {
              (sibling as HTMLElement).style.display = 'none';
            }
          });

          // Ensure container parent has static layout at top
          parent.style.position = 'static';
          parent.style.top = '0';
          parent.style.left = '0';
          parent.style.transform = 'none';
          parent.style.margin = '0 auto';
          parent.style.padding = '0';
          parent.style.width = '850px';

          child = parent;
          parent = parent.parentElement;
        }

        if (clonedDoc.body) {
          Array.from(clonedDoc.body.children).forEach((topChild) => {
            if (topChild !== child) {
              (topChild as HTMLElement).style.display = 'none';
            }
          });
        }

        // Style the target element
        targetInClone.style.position = 'relative';
        targetInClone.style.top = '0';
        targetInClone.style.left = '0';
        targetInClone.style.transform = 'none';
        targetInClone.style.margin = '0 auto';
        targetInClone.style.width = '850px';
        targetInClone.style.maxWidth = '850px';
        targetInClone.style.backgroundColor = '#ffffff';
        targetInClone.style.border = 'none';
        targetInClone.style.boxShadow = 'none';
        targetInClone.style.outline = 'none';
      } else {
        // Fallback positioning reset
        const offscreenElements = clonedDoc.querySelectorAll('.pdf-render-offscreen, [data-pdf-container]');
        offscreenElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.position = 'static';
          htmlEl.style.top = '0';
          htmlEl.style.left = '0';
          htmlEl.style.transform = 'none';
          htmlEl.style.margin = '0';
          htmlEl.style.padding = '0';
        });
      }

      // 3. Remove all outer borders, outlines and box shadows from document containers
      const printableDocs = clonedDoc.querySelectorAll('.printable-document, [data-pdf-container] > div');
      printableDocs.forEach((doc) => {
        const htmlDoc = doc as HTMLElement;
        htmlDoc.style.border = 'none';
        htmlDoc.style.boxShadow = 'none';
        htmlDoc.style.outline = 'none';
      });

      // 4. Hide all pad space text labels and helper text for PDF download
      const padLabels = clonedDoc.querySelectorAll('.pad-space-label, .no-print');
      padLabels.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      // 5. Clear borders/backgrounds of pad space containers so top gap is 100% clean white
      const padBoxes = clonedDoc.querySelectorAll('.pad-space-box');
      padBoxes.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.border = 'none';
        htmlEl.style.background = 'transparent';
      });

      await sanitizeClonedDocForHtml2Canvas(clonedDoc);
    }
  });

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    throw new Error('Canvas render failed or element has zero dimensions');
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Legal dimensions (215.9mm x 355.6mm) or A4 (210mm x 297mm)
  const pdf = new jsPDF('p', 'mm', paperFormat);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  // Single-page document check: if image height fits within 1 page (or slightly exceeds up to 15% margin overflow)
  const isSinglePageFit = imgHeight <= pdfHeight * 1.15;

  if (imgHeight <= pdfHeight) {
    // Fits naturally within 1 page - maintain exact original aspect ratio without vertical stretching!
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  } else if (isSinglePageFit && paperFormat === 'a4') {
    // Slightly exceeds 1 page (up to 15%), scale down proportionally to fit on 1 page without any vertical/horizontal distortion
    const scale = pdfHeight / imgHeight;
    const scaledWidth = imgWidth * scale;
    const scaledHeight = pdfHeight;
    const xOffset = (pdfWidth - scaledWidth) / 2;
    pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, scaledHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Handle multi-page documents if element height exceeds 1 page
    while (heightLeft > 3) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  }

  const pdfBlob = pdf.output('blob');

  // Trigger download if required
  if (fileName) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(pdfBlob);
    link.href = url;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return pdfBlob;
}

/**
 * Downloads selected agreement documents as a ZIP package containing high quality PDFs
 */
export async function downloadAllDocumentsZip(
  data: InstituteAgreementData,
  elementMap: Record<DocumentType, HTMLElement | null>,
  onProgress?: (current: number, total: number, docTitle: string) => void
): Promise<void> {
  const zip = new JSZip();
  const cleanInstName = (data.instituteName || 'Institute').replace(/[^a-zA-Z0-9_ -]/g, '').trim();
  
  // Filter docs if selectedDocuments is specified
  const docsToProcess = (data.selectedDocuments && data.selectedDocuments.length > 0)
    ? DOCUMENT_LIST.filter(d => data.selectedDocuments!.includes(d.id))
    : DOCUMENT_LIST;

  const total = docsToProcess.length;

  for (let i = 0; i < total; i++) {
    const docInfo = docsToProcess[i];
    const element = elementMap[docInfo.id];

    if (element) {
      if (onProgress) {
        onProgress(i + 1, total, docInfo.title);
      }

      try {
        // Agreement uses 'legal' paper size, all other documents use 'a4'
        const paperFormat: 'legal' | 'a4' = docInfo.id === 'agreement' ? 'legal' : 'a4';
        const pdfBlob = await downloadElementAsPdf(element, '', paperFormat);
        const sanitizedDocName = `${i + 1}_${docInfo.title.replace(/\s+/g, '_')}.pdf`;
        zip.file(sanitizedDocName, pdfBlob);
      } catch (err) {
        console.error(`Failed to generate PDF for ${docInfo.title}:`, err);
      }
    }
  }

  const zipContent = await zip.generateAsync({ type: 'blob' });
  const zipFileName = `${cleanInstName}_Selected_Documents_Package.zip`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(zipContent);
  link.href = url;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

