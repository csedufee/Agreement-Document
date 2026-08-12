import { GeneratedDocumentInfo } from '../types';

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

export const DOCUMENT_LIST: GeneratedDocumentInfo[] = [
  {
    id: 'agreement',
    title: 'Software agreement',
    titleBn: 'Software Agreement',
    description: 'Educational Institution Management Software Service Agreement Contract'
  },
  {
    id: 'mef',
    title: 'SSL MEF Form',
    titleBn: 'SSL Merchant Enrolment Form (MEF)',
    description: 'SSLCOMMERZ Merchant Enrolment Form & Terms'
  },
  {
    id: 'authorization',
    title: 'SSL Authorization Letter',
    titleBn: 'SSL Authorization Letter',
    description: 'SSLCOMMERZ Payment Gateway Authorization Letter'
  },
  {
    id: 'web_portal',
    title: 'SSL Web Portal Request',
    titleBn: 'SSL Web Portal Request',
    description: 'Request to update signup portal letter'
  },
  {
    id: 'paybill',
    title: 'bKash PayBill Letter',
    titleBn: 'bKash PayBill Letter',
    description: 'bKash Collection Solution Letter of Interest & Authorization'
  },
  {
    id: 'dynamic_charging',
    title: 'bKash Dynamic Charging Letter',
    titleBn: 'bKash Dynamic Charging Letter',
    description: 'bKash Dynamic Charging Collection Letter'
  },
  {
    id: 'board_resolution',
    title: 'bKash Board Resolution',
    titleBn: 'bKash Board Resolution',
    description: 'bKash Board Resolution & Authorization Letter'
  },
  {
    id: 'declaration',
    title: 'bKash Declaration of Personal Details',
    titleBn: 'bKash Personal Details Declaration',
    description: 'Declaration of Board of Trustees / Managing Committee Members'
  },
  {
    id: 'domain_forwarding',
    title: 'Domain Forwarding Letter',
    titleBn: 'Domain Forwarding Letter (BTCL)',
    description: 'Request Letter to BTCL for New Web Address / Domain Forwarding'
  }
];
