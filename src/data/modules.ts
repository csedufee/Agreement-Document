import { CategoryInfo, DocumentCategory, DocumentType, GeneratedDocumentInfo, InstituteAgreementData } from '../types';

export const BASE_MODULES = [
  'Home',
  'Dashboard',
  'Student',
  'Fees Management',
  'Open Payment',
  'Message',
  'Master Setting',
  'User Management',
  'Online Admission',
  'Support Portal',
  'Human Resource'
];

export const OPTIONAL_MODULES = [
  'Student Attendance',
  'HR Attendance',
  'Class Test',
  'Semester Exam',
  'Combined Result',
  'General Accounts',
  'Routine Management',
  'Layout Management'
];

export function calculateServiceCharge(selectedOptionalCount: number): number {
  if (selectedOptionalCount <= 0) return 0;
  return 40 + (selectedOptionalCount - 1) * 15;
}

export function formatServiceChargeSummary(data: Partial<InstituteAgreementData>): string {
  let summary = '';
  const method = data.chargeMethod || 'module_wise';
  if (method === 'transaction_percentage') {
    summary = `${data.transactionPercentage || 1.5}%`;
  } else if (method === 'monthly_charge') {
    const amt = data.monthlyChargeAmount || data.calculatedServiceCharge || 0;
    summary = `৳${Number(amt).toLocaleString()}/month`;
  } else {
    // module wise
    const fee = (data.customModuleWiseFee && Number(data.customModuleWiseFee) > 0)
      ? Number(data.customModuleWiseFee)
      : (data.calculatedServiceCharge !== undefined ? data.calculatedServiceCharge : calculateServiceCharge(data.selectedOptionalModules?.length || 0));
    summary = `৳${fee}`;
  }

  if (data.enablePerTransactionRate && data.perTransactionRateAmount) {
    summary += ` + ৳${data.perTransactionRateAmount}/trx`;
  }

  return summary;
}

/**
 * Calculates expiry date given a start date string in DD/MM/YYYY format or Date object.
 * Example: 08/08/2026 -> 07/08/2027
 */
export function calculateExpiryDate(startDateStr: string): string {
  try {
    let dateObj: Date;
    if (startDateStr.includes('/')) {
      const parts = startDateStr.split('/');
      if (parts.length === 3) {
        // Assume DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        dateObj = new Date(year, month, day);
      } else {
        dateObj = new Date();
      }
    } else {
      dateObj = new Date(startDateStr);
    }

    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
    }

    // Add 1 year minus 1 day
    const expiryObj = new Date(dateObj);
    expiryObj.setFullYear(expiryObj.getFullYear() + 1);
    expiryObj.setDate(expiryObj.getDate() - 1);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(expiryObj.getDate())}/${pad(expiryObj.getMonth() + 1)}/${expiryObj.getFullYear()}`;
  } catch {
    return '07/08/2027';
  }
}

export function getCurrentFormattedDate(): string {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export const DOCUMENT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'software',
    name: 'Software',
    badge: '1 Document',
    description: 'EMS & Cloud Education Software Service Agreement',
    documents: ['agreement']
  },
  {
    id: 'website',
    name: 'Website',
    badge: '2 Documents',
    description: 'Dynamic Institution Website & BTCL Domain Forwarding',
    documents: ['website_work_order', 'domain_forwarding']
  },
  {
    id: 'spg',
    name: 'SPG',
    badge: '4 Documents',
    description: 'Sonali Payment Gateway Approval, Vendor Change & Split Accounts',
    documents: ['spg_approval', 'spg_vendor_change', 'spg_software_charge', 'spg_split_account']
  },
  {
    id: 'ssl',
    name: 'SSL',
    badge: '3 Documents',
    description: 'SSLCOMMERZ Merchant Enrolment, Auth Letter & Web Portal',
    documents: ['mef', 'authorization', 'web_portal']
  },
  {
    id: 'bkash',
    name: 'bKash',
    badge: '5 Documents',
    description: 'bKash PayBill, Dynamic Charging, Board Resolution & Declarations',
    documents: ['paybill', 'dynamic_charging', 'board_resolution', 'declaration', 'board_declaration']
  }
];

export const DOCUMENT_LIST: GeneratedDocumentInfo[] = [
  // Software Category
  {
    id: 'agreement',
    category: 'software',
    title: 'Software agreement',
    titleBn: 'Software Agreement',
    description: 'Educational Institution Management Software Service Agreement Contract'
  },
  // Website Category
  {
    id: 'website_work_order',
    category: 'website',
    title: 'Website Work Order',
    titleBn: 'Website Work Order',
    description: 'Work Order Letter for Dynamic Website & Education Portal Development'
  },
  {
    id: 'domain_forwarding',
    category: 'website',
    title: 'Domain Forwarding Letter',
    titleBn: 'Domain Forwarding Letter (BTCL)',
    description: 'Request Letter to BTCL for New Web Address / Domain Forwarding'
  },
  // SPG Category
  {
    id: 'spg_approval',
    category: 'spg',
    title: 'SPG Approval Letter',
    titleBn: 'SPG Approval Letter',
    description: 'Sonali Payment Gateway (SPG) Approval Letter'
  },
  {
    id: 'spg_vendor_change',
    category: 'spg',
    title: 'SPG Vendor Change Request',
    titleBn: 'SPG Vendor Change Request',
    description: 'Request Letter to Sonali Bank for SPG Vendor Assignment'
  },
  {
    id: 'spg_software_charge',
    category: 'spg',
    title: 'SPG Software Charge Collection Approval',
    titleBn: 'SPG Software Charge Collection Approval',
    description: 'Request for Approval to Deduct Software Service Charge along with SPG Collection'
  },
  {
    id: 'spg_split_account',
    category: 'spg',
    title: 'SPG Split Account Letter',
    titleBn: 'SPG Split Account Letter',
    description: 'Request for Direct Fund Transfer to Respective Account as per Designated Heads'
  },
  // SSL Category
  {
    id: 'mef',
    category: 'ssl',
    title: 'SSL MEF Form',
    titleBn: 'SSL Merchant Enrolment Form (MEF)',
    description: 'SSLCOMMERZ Merchant Enrolment Form & Terms'
  },
  {
    id: 'authorization',
    category: 'ssl',
    title: 'SSL Authorization Letter',
    titleBn: 'SSL Authorization Letter',
    description: 'SSLCOMMERZ Payment Gateway Authorization Letter'
  },
  {
    id: 'web_portal',
    category: 'ssl',
    title: 'SSL Web Portal Request',
    titleBn: 'SSL Web Portal Request',
    description: 'Request to update signup portal letter'
  },
  // bKash Category
  {
    id: 'paybill',
    category: 'bkash',
    title: 'bKash PayBill Letter',
    titleBn: 'bKash PayBill Letter',
    description: 'bKash Collection Solution Letter of Interest & Authorization'
  },
  {
    id: 'dynamic_charging',
    category: 'bkash',
    title: 'bKash Dynamic Charging Letter',
    titleBn: 'bKash Dynamic Charging Letter',
    description: 'bKash Dynamic Charging Collection Letter'
  },
  {
    id: 'board_resolution',
    category: 'bkash',
    title: 'bKash Board Resolution',
    titleBn: 'bKash Board Resolution',
    description: 'bKash Board Resolution & Authorization Letter'
  },
  {
    id: 'declaration',
    category: 'bkash',
    title: 'bKash Declaration of Personal Details',
    titleBn: 'bKash Personal Details Declaration',
    description: 'Declaration of Board of Trustees / Managing Committee Members'
  },
  {
    id: 'board_declaration',
    category: 'bkash',
    title: 'bKash Declaration of Board Directors',
    titleBn: 'bKash Declaration of Board Directors',
    description: 'Declaration of Personal Details of Board of Directors (Auto for Private Institutes)'
  }
];
