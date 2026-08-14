export interface BankDetails {
  feeHeadName?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  routingNumber: string;
  bankAddress: string;
}

export interface BoardDirector {
  id?: string;
  name: string;
  dob: string;
  nationality: string;
  nid: string;
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
  boardDirectors?: BoardDirector[];
  educationBoard: string;
  studentCount: number | string;
  teacherCount: number | string;
  websiteAddress: string; // Default: pay.academyims.com
  payBillNumber: string;
  dynamicChargeNumber: string;

  // Bank Info
  bankDetails?: BankDetails;
  bankAccounts?: BankDetails[];

  // Selected Modules & Service Charge Methods
  baseModules: string[];
  selectedOptionalModules: string[];
  calculatedServiceCharge: number; // 0 if none, 40 for 1st, +15 for each additional, or custom/method rate
  
  // Service Charge Calculation Methods (1, 2, 4 mutually exclusive; 3 can be combined)
  chargeMethod?: 'module_wise' | 'transaction_percentage' | 'monthly_charge';
  customModuleWiseFee?: number | string; // Override amount for Module Wise method (Option 1)
  transactionPercentage?: number | string; // Percentage for Per Transaction Percentage method (Option 2)
  enablePerTransactionRate?: boolean; // Enable Per Transaction Fixed Rate (Option 3 - can be used with any)
  perTransactionRateAmount?: number | string; // Fixed Rate amount for Option 3
  monthlyChargeAmount?: number | string; // Monthly Fixed Fee for Monthly Charge method (Option 4)

  // System metadata
  websiteOption?: boolean;
  websiteFirstYearFee?: string;
  websiteRenewalFee?: string;
  selectedCategories?: DocumentCategory[];
  selectedDocuments?: DocumentType[];
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentCategory = 'software' | 'website' | 'spg' | 'ssl' | 'bkash';

export interface CategoryInfo {
  id: DocumentCategory;
  name: string;
  description: string;
  badge: string;
  documents: DocumentType[];
}

export type DocumentType = 
  | 'agreement'
  | 'website_work_order'
  | 'domain_forwarding'
  | 'spg_approval'
  | 'spg_vendor_change'
  | 'spg_software_charge'
  | 'spg_split_account'
  | 'mef'
  | 'authorization'
  | 'web_portal'
  | 'paybill'
  | 'dynamic_charging'
  | 'board_resolution'
  | 'declaration'
  | 'board_declaration';

export interface GeneratedDocumentInfo {
  id: DocumentType;
  title: string;
  titleBn: string;
  description: string;
  category: DocumentCategory;
}
