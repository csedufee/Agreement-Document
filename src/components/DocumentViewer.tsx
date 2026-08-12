import React, { useState, useRef } from 'react';
import { 
  FileText, Download, Printer, CheckCircle2, Eye, FolderArchive, 
  Sparkles, Layers, ArrowLeft, RefreshCw, FileCheck
} from 'lucide-react';
import { DocumentType, InstituteAgreementData } from '../types';
import { DOCUMENT_LIST } from '../data/modules';
import { AgreementDoc } from './DocumentTemplates/AgreementDoc';
import { MEFFormDoc } from './DocumentTemplates/MEFFormDoc';
import { AuthorizationLetterDoc } from './DocumentTemplates/AuthorizationLetterDoc';
import { WebPortalDoc } from './DocumentTemplates/WebPortalDoc';
import { PayBillDoc } from './DocumentTemplates/PayBillDoc';
import { DynamicChargingDoc } from './DocumentTemplates/DynamicChargingDoc';
import { BoardResolutionDoc } from './DocumentTemplates/BoardResolutionDoc';
import { DeclarationDoc } from './DocumentTemplates/DeclarationDoc';
import { DomainForwardingDoc } from './DocumentTemplates/DomainForwardingDoc';
import { downloadElementAsPdf, downloadAllDocumentsZip } from '../utils/pdfGenerator';

interface Props {
  data: InstituteAgreementData;
  onBackToEdit?: () => void;
}

export const DocumentViewer: React.FC<Props> = ({ data, onBackToEdit }) => {
  const [activeTab, setActiveTab] = useState<DocumentType>('agreement');
  const [downloading, setDownloading] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);

  // Hidden references to all document containers for PDF rendering
  const docRefs = useRef<Record<DocumentType, HTMLDivElement | null>>({
    agreement: null,
    mef: null,
    authorization: null,
    web_portal: null,
    paybill: null,
    dynamic_charging: null,
    board_resolution: null,
    declaration: null,
    domain_forwarding: null
  });

  const handleDownloadActivePdf = async () => {
    const currentRef = docRefs.current[activeTab];
    if (!currentRef) return;

    setDownloading(true);
    try {
      const activeDocInfo = DOCUMENT_LIST.find(d => d.id === activeTab);
      const title = activeDocInfo ? activeDocInfo.title : activeTab;
      const paperFormat: 'legal' | 'a4' = activeTab === 'agreement' ? 'legal' : 'a4';
      await downloadElementAsPdf(currentRef, `${data.instituteName || 'Institute'}_${title}.pdf`, paperFormat);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadZipPackage = async () => {
    setDownloading(true);
    setProgressMsg(`Generating ${DOCUMENT_LIST.length} PDF files...`);

    try {
      await downloadAllDocumentsZip(
        data,
        docRefs.current,
        (current, total, docTitle) => {
          setProgressMsg(`Processing ${current}/${total}: ${docTitle}...`);
        }
      );
    } catch (error) {
      console.error("ZIP download failed:", error);
    } finally {
      setDownloading(false);
      setProgressMsg(null);
    }
  };

  const handlePrintCurrent = () => {
    window.print();
  };

  const renderActiveDocument = (type: DocumentType) => {
    switch (type) {
      case 'agreement':
        return <AgreementDoc data={data} showPadHeaderSpace={true} />;
      case 'mef':
        return <MEFFormDoc data={data} showPadHeaderSpace={false} />;
      case 'authorization':
        return <AuthorizationLetterDoc data={data} showPadHeaderSpace={true} />;
      case 'web_portal':
        return <WebPortalDoc data={data} showPadHeaderSpace={true} />;
      case 'paybill':
        return <PayBillDoc data={data} showPadHeaderSpace={true} />;
      case 'dynamic_charging':
        return <DynamicChargingDoc data={data} showPadHeaderSpace={true} />;
      case 'board_resolution':
        return <BoardResolutionDoc data={data} showPadHeaderSpace={true} />;
      case 'declaration':
        return <DeclarationDoc data={data} showPadHeaderSpace={true} />;
      case 'domain_forwarding':
        return <DomainForwardingDoc data={data} showPadHeaderSpace={true} />;
      default:
        return <AgreementDoc data={data} showPadHeaderSpace={true} />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Toolbar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Auto-Generated Document Panel
            </span>
            <span className="text-slate-400 text-xs font-mono">ID: {data.id || 'AGR-NEW'}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {data.instituteName || 'Educational Institution'} - Document Preview
          </h2>
          <p className="text-xs text-slate-300">
            All {DOCUMENT_LIST.length} required official documents are prepared below in A4 format.
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {onBackToEdit && (
            <button
              onClick={onBackToEdit}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          )}

          <div className="text-xs font-medium px-3.5 py-2 rounded-xl border bg-slate-800/80 border-slate-700/80 text-slate-300 flex items-center gap-1.5 shadow-inner">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>
              Pad Space: <strong className="text-emerald-300 font-bold">{activeTab === 'mef' ? 'N/A (MEF Form)' : 'Fixed ON'}</strong>
            </span>
          </div>

          <button
            onClick={handleDownloadActivePdf}
            disabled={downloading}
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Current PDF</span>
          </button>

          <button
            onClick={handleDownloadZipPackage}
            disabled={downloading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {downloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download All {DOCUMENT_LIST.length} PDFs (ZIP)</span>
          </button>
        </div>
      </div>

      {progressMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center justify-center gap-2 animate-pulse no-print">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span className="font-semibold">{progressMsg}</span>
        </div>
      )}

      {/* Document Selection Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 no-print overflow-x-auto">
        <div className="flex gap-1.5 min-w-max p-1">
          {DOCUMENT_LIST.map((doc) => {
            const isActive = activeTab === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visible Active Document View */}
      <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl border border-slate-300 min-h-[600px] flex justify-center overflow-auto shadow-inner">
        <div className="w-full">
          {renderActiveDocument(activeTab)}
        </div>
      </div>

      {/* Offscreen DOM elements for background PDF generation */}
      <div 
        className="pdf-render-offscreen"
        style={{ position: 'absolute', top: '-99999px', left: 0, width: '850px', overflow: 'visible', opacity: 1, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {DOCUMENT_LIST.map((doc) => (
          <div
            key={doc.id}
            data-pdf-container={doc.id}
            ref={(el) => { docRefs.current[doc.id] = el; }}
            className="w-[850px] bg-white"
          >
            {renderActiveDocument(doc.id)}
          </div>
        ))}
      </div>
    </div>
  );
};
