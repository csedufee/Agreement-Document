export interface BankDetails {
  feeHeadName?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  routingNumber: string;
  bankAddress: string;
}

export interface InstituteAgreementData {
  id?: string;
  // Institute & Head Info
  instituteName: string;
  instituteAddress: string;
  upazilaThana: string;
  district: string;
  division: string;
  headName: string; // NID exact
  headDob: string; // NID exact
  headNid: string;
  designation: string;
  date: string; // Auto populated e.g. 08/08/2026
  expiryDate?: string; // Auto calculated: Date + 1 year minus 1 day e.g. 07/08/2027
  headMobile: string; // Used as unique identifier / search key
  instituteEmail: string;
  
  // Leadership & ICT
  chairmanName: string;
  chairmanMobile: string;
  ictInchargeName: string;
  ictInchargeMobile: string;
  
  // Institution Details
  instituteType: 'Govt' | 'MPO' | 'Private' | string;
  educationBoard: string;
  studentCount: number | string;
  teacherCount: number | string;
  websiteAddress: string; // Default: pay.academyims.com
  payBillNumber: string;
  dynamicChargeNumber: string;

  // Bank Info
  bankDetails?: BankDetails;
  bankAccounts?: BankDetails[];

  // Selected Modules
  baseModules: string[];
  selectedOptionalModules: string[];
  calculatedServiceCharge: number; // 0 if none, 40 for 1st, +15 for each additional

  // System metadata
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentType = 
  | 'agreement'
  | 'mef'
  | 'authorization'
  | 'web_portal'
  | 'paybill'
  | 'dynamic_charging'
  | 'board_resolution'
  | 'declaration'
  | 'domain_forwarding';

export interface GeneratedDocumentInfo {
  id: DocumentType;
  title: string;
  titleBn: string;
  description: string;
}
