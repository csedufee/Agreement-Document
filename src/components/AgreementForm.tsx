import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, User, Phone, Mail, MapPin, Calendar, CreditCard, 
  CheckSquare, Square, Layers, Sparkles, AlertCircle, Save, Info,
  Banknote, ShieldAlert, Plus, Trash2, Sliders, CheckCircle,
  FolderKanban, Globe, Lock, ShieldCheck, FileCheck, Check
} from 'lucide-react';
import { BankDetails, BoardDirector, DocumentCategory, DocumentType, InstituteAgreementData } from '../types';
import { 
  BASE_MODULES, 
  OPTIONAL_MODULES, 
  DOCUMENT_CATEGORIES, 
  DOCUMENT_LIST, 
  calculateServiceCharge, 
  getCurrentFormattedDate 
} from '../data/modules';

interface Props {
  initialData?: InstituteAgreementData | null;
  onSubmitSuccess: (savedData: InstituteAgreementData) => void;
  onPreviewDataChange?: (data: InstituteAgreementData) => void;
}

export const AgreementForm: React.FC<Props> = ({ initialData, onSubmitSuccess, onPreviewDataChange }) => {
  const currentDateStr = getCurrentFormattedDate();

  const emptyBank: BankDetails = {
    feeHeadName: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchName: '',
    routingNumber: '',
    bankAddress: ''
  };

  const createEmptyDirector = (): BoardDirector => ({
    name: '',
    dob: '',
    nationality: 'Bangladeshi',
    nid: ''
  });

  const getInitialBankAccounts = (data?: InstituteAgreementData | null): BankDetails[] => {
    if (data?.bankAccounts && data.bankAccounts.length > 0) {
      return data.bankAccounts;
    }
    if (data?.bankDetails && (data.bankDetails.bankName || data.bankDetails.accountNumber)) {
      return [data.bankDetails];
    }
    return [{ ...emptyBank }];
  };

  const getInitialBoardDirectors = (data?: InstituteAgreementData | null, type?: string): BoardDirector[] => {
    if (data?.boardDirectors && data.boardDirectors.length > 0) {
      return data.boardDirectors;
    }
    if (type === 'Private' || data?.instituteType === 'Private') {
      return [createEmptyDirector(), createEmptyDirector()];
    }
    return [];
  };

  const [formData, setFormData] = useState<InstituteAgreementData>({
    instituteName: '',
    instituteAddress: '',
    upazilaThana: '',
    district: '',
    division: '',
    headName: '',
    headDob: '',
    headNid: '',
    designation: '',
    date: currentDateStr,
    headMobile: '',
    instituteEmail: '',
    chairmanName: '',
    chairmanMobile: '',
    ictInchargeName: '',
    ictInchargeMobile: '',
    instituteType: 'MPO',
    educationBoard: '',
    studentCount: 300,
    teacherCount: '',
    websiteAddress: 'pay.academyims.com',
    payBillNumber: '',
    dynamicChargeNumber: '',
    bankDetails: { ...emptyBank },
    bankAccounts: [{ ...emptyBank }],
    baseModules: [...BASE_MODULES],
    selectedOptionalModules: [],
    calculatedServiceCharge: 0,
    chargeMethod: 'module_wise',
    customModuleWiseFee: '',
    transactionPercentage: '1.5',
    monthlyChargeAmount: '',
    enablePerTransactionRate: false,
    perTransactionRateAmount: '',
    websiteOption: false,
    websiteFirstYearFee: '',
    websiteRenewalFee: '',
    selectedCategories: [],
    selectedDocuments: []
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track documents and categories that were already submitted and saved in previous sessions
  const lockedDocuments: DocumentType[] = useMemo(() => {
    return initialData?.selectedDocuments && initialData.selectedDocuments.length > 0
      ? initialData.selectedDocuments
      : [];
  }, [initialData?.id, initialData?.selectedDocuments]);

  const lockedCategories: DocumentCategory[] = useMemo(() => {
    if (!lockedDocuments.length) return [];
    const cats = DOCUMENT_CATEGORIES.filter(cat => 
      cat.documents.some(docId => lockedDocuments.includes(docId))
    ).map(c => c.id);
    return Array.from(new Set(cats));
  }, [lockedDocuments]);

  // Helper to compute effective service fee
  const computeServiceFee = (
    method: 'module_wise' | 'transaction_percentage' | 'monthly_charge' = 'module_wise',
    optModulesCount: number = 0,
    customFee?: number | string,
    percentage?: number | string,
    monthlyAmt?: number | string
  ): number => {
    if (method === 'module_wise') {
      if (customFee !== undefined && customFee !== '' && !isNaN(Number(customFee))) {
        return Number(customFee);
      }
      return calculateServiceCharge(optModulesCount);
    } else if (method === 'transaction_percentage') {
      return Number(percentage) || 0;
    } else if (method === 'monthly_charge') {
      return Number(monthlyAmt) || 0;
    }
    return 0;
  };

  // Populate initial data when editing or loaded from search
  useEffect(() => {
    if (initialData) {
      const bankAccountsList = getInitialBankAccounts(initialData);
      const directorsList = getInitialBoardDirectors(initialData, initialData.instituteType);
      const method = initialData.chargeMethod || 'module_wise';
      const optCount = initialData.selectedOptionalModules?.length || 0;
      const initialFee = initialData.calculatedServiceCharge !== undefined
        ? initialData.calculatedServiceCharge
        : computeServiceFee(
            method,
            optCount,
            initialData.customModuleWiseFee,
            initialData.transactionPercentage,
            initialData.monthlyChargeAmount
          );

      setFormData({
        ...initialData,
        date: initialData.date || currentDateStr,
        websiteAddress: initialData.websiteAddress || 'pay.academyims.com',
        baseModules: initialData.baseModules && initialData.baseModules.length > 0 
          ? initialData.baseModules 
          : [...BASE_MODULES],
        bankAccounts: bankAccountsList,
        bankDetails: bankAccountsList[0] || { ...emptyBank },
        boardDirectors: directorsList,
        chargeMethod: method,
        customModuleWiseFee: initialData.customModuleWiseFee ?? '',
        transactionPercentage: initialData.transactionPercentage ?? '1.5',
        monthlyChargeAmount: initialData.monthlyChargeAmount ?? '',
        enablePerTransactionRate: initialData.enablePerTransactionRate ?? false,
        perTransactionRateAmount: initialData.perTransactionRateAmount ?? '',
        calculatedServiceCharge: initialFee,
        websiteOption: initialData.websiteOption ?? false,
        websiteFirstYearFee: initialData.websiteFirstYearFee || '',
        websiteRenewalFee: initialData.websiteRenewalFee || '',
        selectedCategories: initialData.selectedCategories || [],
        selectedDocuments: initialData.selectedDocuments || []
      });
    }
  }, [initialData]);

  // Recalculate service charge whenever optional modules or pricing methods change
  useEffect(() => {
    const fee = computeServiceFee(
      formData.chargeMethod,
      formData.selectedOptionalModules.length,
      formData.customModuleWiseFee,
      formData.transactionPercentage,
      formData.monthlyChargeAmount
    );
    if (formData.calculatedServiceCharge !== fee) {
      const updated = {
        ...formData,
        calculatedServiceCharge: fee
      };
      setFormData(updated);
      if (onPreviewDataChange) {
        onPreviewDataChange(updated);
      }
    }
  }, [
    formData.selectedOptionalModules,
    formData.chargeMethod,
    formData.customModuleWiseFee,
    formData.transactionPercentage,
    formData.monthlyChargeAmount
  ]);

  const banglaToEnglishDigits = (str: string) => {
    if (typeof str !== 'string') return str;
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let res = str;
    for (let i = 0; i < 10; i++) {
      res = res.replace(new RegExp(banglaDigits[i], 'g'), i.toString());
    }
    return res;
  };

  const sanitizeInput = (val: string) => {
    if (typeof val !== 'string') return val;
    let converted = banglaToEnglishDigits(val);
    return converted.replace(/[\u0980-\u09FF]/g, '');
  };

  const handleChange = (field: keyof InstituteAgreementData, value: any) => {
    let val = value;
    if (typeof val === 'string') {
      val = sanitizeInput(val);
    }
    let updated = { ...formData, [field]: val };

    if (field === 'instituteType') {
      let currentDocs = [...(formData.selectedDocuments || [])];
      const isBkashActive = (formData.selectedCategories || []).includes('bkash');

      if (val === 'Private') {
        if (!updated.boardDirectors || updated.boardDirectors.length < 2) {
          updated.boardDirectors = [
            updated.boardDirectors?.[0] || createEmptyDirector(),
            updated.boardDirectors?.[1] || createEmptyDirector()
          ];
        }
        // Auto-include bKash board_declaration if bkash category is selected
        if (isBkashActive && !currentDocs.includes('board_declaration')) {
          currentDocs.push('board_declaration');
        }
      } else {
        // Auto-remove bKash board_declaration if institute is not Private
        currentDocs = currentDocs.filter(d => d !== 'board_declaration');
      }
      updated.selectedDocuments = currentDocs;
    }

    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  // Category Toggle Handler
  const handleToggleCategory = (catId: DocumentCategory) => {
    const isSelected = (formData.selectedCategories || []).includes(catId);
    const catInfo = DOCUMENT_CATEGORIES.find(c => c.id === catId);
    if (!catInfo) return;

    let newCats: DocumentCategory[];
    let newDocs: DocumentType[];

    if (isSelected) {
      // Check if this category contains locked documents from a previous submission
      const hasLockedDocsInCat = catInfo.documents.some(d => lockedDocuments.includes(d));
      if (hasLockedDocsInCat) {
        setError(`"${catInfo.name}" ক্যাটাগরিটি আনমার্ক করা যাবে না কারণ এতে ইতিমধ্যে জেনারেটকৃত ডকুমেন্ট অন্তর্ভুক্ত রয়েছে। তবে আপনি নতুন ডকুমেন্ট বা ক্যাটাগরি যুক্ত করতে পারবেন।`);
        return;
      }

      // Unselect category and remove only non-locked documents
      newCats = (formData.selectedCategories || []).filter(c => c !== catId);
      newDocs = (formData.selectedDocuments || []).filter(d => !catInfo.documents.includes(d));
    } else {
      setError(null);
      // Select category and add all its documents by default
      newCats = [...(formData.selectedCategories || []), catId];
      const docsToAdd = catInfo.documents.filter(d => {
        if (d === 'board_declaration') {
          // Document 5 of bKash is only included for Private institutes
          return formData.instituteType === 'Private';
        }
        return true;
      });
      newDocs = Array.from(new Set([...(formData.selectedDocuments || []), ...docsToAdd]));
    }

    const updated = {
      ...formData,
      selectedCategories: newCats,
      selectedDocuments: newDocs
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  // Document Checkbox Toggle Handler within a selected category
  const handleToggleDocument = (docId: DocumentType) => {
    // If document is previously submitted/locked, it cannot be unmarked
    if (lockedDocuments.includes(docId)) {
      setError('ইতিমধ্যে সাবমিট ও জেনারেটকৃত ডকুমেন্ট আনমার্ক করা যাবে না।');
      return;
    }

    // bKash Document 5 cannot be manually toggled by the user
    if (docId === 'board_declaration') {
      return;
    }

    setError(null);
    const currentDocs = formData.selectedDocuments || [];
    const isSelected = currentDocs.includes(docId);
    let newDocs: DocumentType[];

    if (isSelected) {
      newDocs = currentDocs.filter(d => d !== docId);
    } else {
      newDocs = [...currentDocs, docId];
    }

    const updated = {
      ...formData,
      selectedDocuments: newDocs
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleDirectorChange = (index: number, field: keyof BoardDirector, value: string) => {
    let val = value;
    if (field === 'nid' || field === 'dob') {
      val = sanitizeInput(val);
    }
    const currentDirs = formData.boardDirectors && formData.boardDirectors.length > 0
      ? [...formData.boardDirectors]
      : [createEmptyDirector(), createEmptyDirector()];

    currentDirs[index] = {
      ...currentDirs[index],
      [field]: val
    };

    const updated = {
      ...formData,
      boardDirectors: currentDirs
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleAddDirector = () => {
    const currentDirs = formData.boardDirectors && formData.boardDirectors.length > 0
      ? [...formData.boardDirectors]
      : [createEmptyDirector(), createEmptyDirector()];

    currentDirs.push(createEmptyDirector());

    const updated = {
      ...formData,
      boardDirectors: currentDirs
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleRemoveDirector = (index: number) => {
    const currentDirs = formData.boardDirectors && formData.boardDirectors.length > 0
      ? [...formData.boardDirectors]
      : [createEmptyDirector(), createEmptyDirector()];

    if (currentDirs.length <= 2) return;

    currentDirs.splice(index, 1);

    const updated = {
      ...formData,
      boardDirectors: currentDirs
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleBankChange = (index: number, field: keyof BankDetails, value: string) => {
    const currentAccounts = formData.bankAccounts && formData.bankAccounts.length > 0
      ? [...formData.bankAccounts]
      : [{ ...emptyBank }];

    let val = sanitizeInput(value);
    if (field === 'routingNumber' || field === 'accountNumber') {
      val = val.replace(/[^0-9]/g, '');
    }

    currentAccounts[index] = {
      ...currentAccounts[index],
      [field]: val
    };

    const updated = {
      ...formData,
      bankAccounts: currentAccounts,
      bankDetails: currentAccounts[0]
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleAddBankAccount = () => {
    const currentAccounts = formData.bankAccounts && formData.bankAccounts.length > 0
      ? [...formData.bankAccounts]
      : [{ ...emptyBank }];

    currentAccounts.push({ ...emptyBank });

    const updated = {
      ...formData,
      bankAccounts: currentAccounts,
      bankDetails: currentAccounts[0]
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const handleRemoveBankAccount = (index: number) => {
    const currentAccounts = formData.bankAccounts && formData.bankAccounts.length > 0
      ? [...formData.bankAccounts]
      : [{ ...emptyBank }];

    if (currentAccounts.length <= 1) return;

    currentAccounts.splice(index, 1);

    const updated = {
      ...formData,
      bankAccounts: currentAccounts,
      bankDetails: currentAccounts[0]
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const toggleOptionalModule = (moduleName: string) => {
    const current = [...formData.selectedOptionalModules];
    const index = current.indexOf(moduleName);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(moduleName);
    }
    const fee = computeServiceFee(
      formData.chargeMethod,
      current.length,
      formData.customModuleWiseFee,
      formData.transactionPercentage,
      formData.monthlyChargeAmount
    );
    const updated = {
      ...formData,
      selectedOptionalModules: current,
      calculatedServiceCharge: fee
    };
    setFormData(updated);
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  };

  const isValidBDMobile = (mobile: string) => {
    if (!mobile) return false;
    return /^01[3-9]\d{8}$/.test(mobile.trim());
  };

  // Determine dynamic section visibility based on selected documents
  const selectedDocs = formData.selectedDocuments || [];
  const selectedCats = formData.selectedCategories || [];
  const isBkashSelected = selectedCats.includes('bkash');

  // Section 1 & Section 2: ALWAYS VISIBLE as specified by user intent
  const isBasicInfoVisible = true;
  const isAuthorityInfoVisible = true;

  // Section 3: Board Directors Information - ONLY when bKash category is selected AND Institute Type is Private
  const isBoardDirectorsVisible = isBkashSelected && formData.instituteType === 'Private';

  // Section 4: Bank Account Details
  const isBankDetailsVisible = 
    selectedDocs.includes('spg_approval') ||
    selectedDocs.includes('spg_vendor_change') ||
    selectedDocs.includes('spg_split_account') ||
    selectedDocs.includes('spg_software_charge') ||
    selectedDocs.includes('mef') ||
    selectedDocs.includes('authorization') ||
    selectedDocs.includes('paybill') ||
    selectedDocs.includes('dynamic_charging');

  // Section 5: Software Modules & Service Charge Calculation
  const isSoftwareModuleVisible = 
    selectedDocs.includes('agreement') ||
    selectedDocs.includes('spg_software_charge');

  // Section 6: Website Configuration & Charges (Visible when Website Work Order OR Software Agreement is selected)
  const isWebsiteConfigVisible = 
    selectedDocs.includes('website_work_order') || 
    selectedDocs.includes('agreement');

  // Section 7: bKash Specific Numbers (PayBill & Dynamic Charging)
  const isBkashNumbersVisible = 
    selectedDocs.includes('paybill') ||
    selectedDocs.includes('dynamic_charging');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation 0: At least one category and document must be selected
    if (selectedCats.length === 0 || selectedDocs.length === 0) {
      setError('Please select at least one document category and document to proceed with agreement creation.');
      return;
    }

    // Prevent any Bangla input characters
    const hasBanglaText = Object.values(formData).some(val => {
      if (typeof val === 'string') {
        return /[\u0980-\u09FF]/.test(val);
      }
      return false;
    });

    if (hasBanglaText) {
      setError('Bangla text is not allowed. Please enter all information in English.');
      return;
    }

    // Validation Section 1: Basic Institute Details (Always mandatory)
    if (!formData.instituteName.trim()) {
      setError('Institute Name is required.');
      return;
    }
    if (!formData.instituteAddress.trim()) {
      setError('Full Institute Address is required.');
      return;
    }
    if (!formData.upazilaThana.trim()) {
      setError('Upazila / Thana name is required.');
      return;
    }
    if (!formData.district.trim()) {
      setError('District name is required.');
      return;
    }
    if (!formData.division.trim()) {
      setError('Division name is required.');
      return;
    }
    if (!formData.educationBoard.trim()) {
      setError('Education Board name is required.');
      return;
    }
    if (!formData.studentCount || Number(formData.studentCount) < 300) {
      setError('Student count must be at least 300.');
      return;
    }
    if (!formData.teacherCount) {
      setError('Teacher count is required.');
      return;
    }
    if (!formData.websiteAddress.trim()) {
      setError('Website address is required.');
      return;
    }

    // Validation Section 2: Authority Details (Always mandatory)
    if (!formData.headName.trim()) {
      setError('Headmaster / Principal Name (as per NID) is required.');
      return;
    }
    if (!formData.headDob.trim()) {
      setError('Headmaster / Principal Date of Birth (as per NID) is required.');
      return;
    }
    if (!formData.headNid.trim()) {
      setError('Headmaster / Principal NID Number is required.');
      return;
    }
    if (!formData.headMobile.trim()) {
      setError('Institute Head Mobile Number is required.');
      return;
    }
    if (!isValidBDMobile(formData.headMobile)) {
      setError('Institute Head Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
      return;
    }
    if (!formData.instituteEmail.trim()) {
      setError('Institute Email is required.');
      return;
    }
    if (formData.chairmanMobile.trim() && !isValidBDMobile(formData.chairmanMobile)) {
      setError('Chairman Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
      return;
    }
    if (formData.ictInchargeMobile.trim() && !isValidBDMobile(formData.ictInchargeMobile)) {
      setError('ICT In-Charge Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
      return;
    }

    // Validation Section 3: Private Institute Board Directors (if active)
    if (isBoardDirectorsVisible && formData.instituteType === 'Private') {
      const directors = formData.boardDirectors || [];
      if (directors.length < 2) {
        setError('Private Institutions must provide information for at least 2 Board Directors.');
        return;
      }
      for (let i = 0; i < directors.length; i++) {
        const dir = directors[i];
        if (!dir.name || !dir.name.trim()) {
          setError(`Board Director #${i + 1}: Name is required.`);
          return;
        }
        if (!dir.dob || !dir.dob.trim()) {
          setError(`Board Director #${i + 1}: Date of Birth is required.`);
          return;
        }
        if (!dir.nationality || !dir.nationality.trim()) {
          setError(`Board Director #${i + 1}: Nationality is required.`);
          return;
        }
        if (!dir.nid || !dir.nid.trim()) {
          setError(`Board Director #${i + 1}: NID Number is required.`);
          return;
        }
      }
    }

    // Validation Section 4: Bank Account Details (if active and filled)
    if (isBankDetailsVisible) {
      const bankAccountsToValidate = formData.bankAccounts && formData.bankAccounts.length > 0
        ? formData.bankAccounts
        : formData.bankDetails
        ? [formData.bankDetails]
        : [];

      for (let i = 0; i < bankAccountsToValidate.length; i++) {
        const acc = bankAccountsToValidate[i];
        const feeHead = (acc.feeHeadName || '').trim();
        const bankName = (acc.bankName || '').trim();
        const accName = (acc.accountName || '').trim();
        const accNum = (acc.accountNumber || '').trim();
        const branch = (acc.branchName || '').trim();
        const routing = (acc.routingNumber || '').trim();
        const address = (acc.bankAddress || '').trim();

        const isAnyFieldFilled = Boolean(feeHead || bankName || accName || accNum || branch || routing || address);

        if (isAnyFieldFilled) {
          const accLabel = bankAccountsToValidate.length > 1 ? `Account #${i + 1}: ` : '';
          if (!feeHead) {
            setError(`Bank ${accLabel}Fee Head Name is required (bank details entry started).`);
            return;
          }
          if (!bankName) {
            setError(`Bank ${accLabel}Bank Name is required (bank details entry started).`);
            return;
          }
          if (!accName) {
            setError(`Bank ${accLabel}Account Name is required (bank details entry started).`);
            return;
          }
          if (!accNum) {
            setError(`Bank ${accLabel}Account Number is required (bank details entry started).`);
            return;
          }
          if (!branch) {
            setError(`Bank ${accLabel}Branch Name is required (bank details entry started).`);
            return;
          }
          if (!routing) {
            setError(`Bank ${accLabel}Routing Number is required (bank details entry started).`);
            return;
          }
          if (!address) {
            setError(`Bank ${accLabel}Branch Address is required (bank details entry started).`);
            return;
          }
        }
      }
    }

    // Validation Section 5: Service Charge Calculation Methods (if active)
    if (isSoftwareModuleVisible) {
      if (formData.chargeMethod === 'transaction_percentage') {
        const pct = Number(formData.transactionPercentage);
        if (!formData.transactionPercentage || isNaN(pct) || pct < 0.03) {
          setError('Per transaction percentage rate cannot be less than 0.03% (Minimum 0.03%).');
          return;
        }
      } else if (formData.chargeMethod === 'monthly_charge') {
        const amt = Number(formData.monthlyChargeAmount);
        if (!formData.monthlyChargeAmount || isNaN(amt) || amt < 1000) {
          setError('Monthly fixed charge cannot be less than 1,000 BDT (Minimum ৳1,000).');
          return;
        }
      } else if (formData.chargeMethod === 'module_wise') {
        if (formData.customModuleWiseFee && formData.customModuleWiseFee.trim() !== '') {
          const fee = Number(formData.customModuleWiseFee);
          if (isNaN(fee) || fee < 40) {
            setError('Custom module-wise fee cannot be less than 40 BDT (Minimum ৳40).');
            return;
          }
        }
      }

      if (formData.enablePerTransactionRate) {
        const perTrx = Number(formData.perTransactionRateAmount);
        if (!formData.perTransactionRateAmount || isNaN(perTrx) || perTrx < 3) {
          setError('Per transaction fixed rate cannot be less than 3 BDT (Minimum ৳3).');
          return;
        }
      }
    }

    // Validation Section 6: Website Charges & Pricing (if active)
    if (isWebsiteConfigVisible) {
      const isWorkOrder = selectedDocs.includes('website_work_order');
      
      // 1st Year Fee Validation
      const rawFirstYear = (formData.websiteFirstYearFee || '').toString().trim();
      if (isWorkOrder && !rawFirstYear) {
        setError('1st Year Charge is required for Website Work Order (Minimum ৳8,000).');
        return;
      }
      if (rawFirstYear !== '') {
        const fee1 = Number(rawFirstYear);
        if (isNaN(fee1) || fee1 < 8000) {
          setError('Website 1st Year Charge cannot be less than 8,000 BDT (Minimum ৳8,000).');
          return;
        }
      }

      // Renewal Fee Validation
      const rawRenewal = (formData.websiteRenewalFee || '').toString().trim();
      if (isWorkOrder && !rawRenewal) {
        setError('Yearly Renewal Charge is required for Website Work Order (Minimum ৳4,000).');
        return;
      }
      if (rawRenewal !== '') {
        const feeRenew = Number(rawRenewal);
        if (isNaN(feeRenew) || feeRenew < 4000) {
          setError('Website Yearly Renewal Charge cannot be less than 4,000 BDT (Minimum ৳4,000).');
          return;
        }
      }
    }

    // Validation Section 7: bKash Numbers (if active)
    if (isBkashNumbersVisible) {
      if (selectedDocs.includes('paybill')) {
        if (!formData.payBillNumber.trim()) {
          setError('PayBill Mobile Number is required for bKash PayBill Letter.');
          return;
        }
        if (!isValidBDMobile(formData.payBillNumber)) {
          setError('PayBill Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
          return;
        }
      }
      if (selectedDocs.includes('dynamic_charging')) {
        if (!formData.dynamicChargeNumber.trim()) {
          setError('Dynamic Charge Mobile Number is required for bKash Dynamic Charging Letter.');
          return;
        }
        if (!isValidBDMobile(formData.dynamicChargeNumber)) {
          setError('Dynamic Charge Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
          return;
        }
      }
    }

    const dataToSave = {
      ...formData,
      designation: formData.designation.trim() || 'Headmaster / Principal'
    };

    setSubmitting(true);

    try {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        onSubmitSuccess(json.data);
      } else {
        setError(json.error || 'Failed to submit the form.');
      }
    } catch (err: any) {
      setError('Failed to submit data to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Form Title Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Category-Driven Document Generator
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            <span>Educational Institution Details & Service Agreement Form</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Select categories to enable aligned documents and input fields. Fill out required information in English.
          </p>
        </div>

        <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs text-slate-700 flex items-center gap-2 font-mono border border-slate-200">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Date: <strong className="text-slate-900">{formData.date}</strong> (Auto)</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* TOP SECTION: Category & Aligned Document Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              <span>Document Categories & Aligned Documents</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select one or more categories below. All aligned documents in selected categories will be checked by default.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Selected Docs: <strong className="text-blue-600 font-mono font-bold">{selectedDocs.length}</strong>
            </span>
          </div>
        </div>

        {/* Category Cards Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const isCatSelected = selectedCats.includes(cat.id);
            const isCatLocked = lockedCategories.includes(cat.id);
            const docsInThisCat = cat.documents;
            const selectedDocsCount = docsInThisCat.filter(d => selectedDocs.includes(d)).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleToggleCategory(cat.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between relative select-none ${
                  isCatLocked
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/40 shadow-sm'
                    : isCatSelected
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/40 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isCatSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCatLocked && <Lock className="w-2.5 h-2.5 text-amber-300 shrink-0" />}
                      <span>{cat.name}</span>
                    </span>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isCatSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400 bg-white'
                    }`}>
                      {isCatSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{cat.badge}</span>
                  {isCatSelected && (
                    <span className="font-bold text-blue-700 font-mono flex items-center gap-1">
                      {selectedDocsCount}/{docsInThisCat.length} Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aligned Documents List per Selected Category */}
        {selectedCats.length > 0 ? (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Aligned Documents in Selected Categories</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                {lockedDocuments.length > 0
                  ? 'Previously generated documents are locked. You can check new documents.'
                  : 'You can toggle individual documents as needed.'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCUMENT_CATEGORIES.filter(c => selectedCats.includes(c.id)).map(cat => {
                const catDocs = DOCUMENT_LIST.filter(d => d.category === cat.id);

                return (
                  <div key={cat.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>{cat.name} Documents</span>
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                        {catDocs.filter(d => selectedDocs.includes(d.id)).length} / {catDocs.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {catDocs.map((doc, idx) => {
                        const isDocChecked = selectedDocs.includes(doc.id);
                        const isLockedDoc = lockedDocuments.includes(doc.id);
                        const isBkashFifthDoc = doc.id === 'board_declaration';

                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              if (isLockedDoc) {
                                setError('ইতিমধ্যে সাবমিট ও জেনারেটকৃত ডকুমেন্ট আনমার্ক করা যাবে না।');
                                return;
                              }
                              if (!isBkashFifthDoc) {
                                handleToggleDocument(doc.id);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2 text-xs ${
                              isLockedDoc
                                ? 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-xs cursor-not-allowed'
                                : isBkashFifthDoc
                                ? formData.instituteType === 'Private'
                                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 cursor-not-allowed'
                                  : 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-75 cursor-not-allowed'
                                : isDocChecked
                                ? 'bg-white border-blue-400 text-slate-900 shadow-xs cursor-pointer hover:border-blue-500'
                                : 'bg-white/60 border-slate-200 text-slate-500 cursor-pointer hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="mt-0.5">
                                {isLockedDoc ? (
                                  <div className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs">
                                    <Lock className="w-2.5 h-2.5" />
                                  </div>
                                ) : isDocChecked ? (
                                  <CheckSquare className={`w-4 h-4 ${isBkashFifthDoc ? 'text-emerald-600' : 'text-blue-600'}`} />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                              </div>

                              <div>
                                <div className="font-semibold text-xs flex items-center gap-1.5 flex-wrap">
                                  <span>{idx + 1}. {doc.title}</span>
                                  {isLockedDoc && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300">
                                      <Lock className="w-2.5 h-2.5 text-amber-700" />
                                      Generated (Locked)
                                    </span>
                                  )}
                                  {isBkashFifthDoc && !isLockedDoc && (
                                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-flex items-center gap-1 ${
                                      formData.instituteType === 'Private'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}>
                                      <Lock className="w-2.5 h-2.5" />
                                      {formData.instituteType === 'Private'
                                        ? 'Auto-included for Private'
                                        : 'Not Applicable (Private Only)'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {doc.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isLockedDoc ? (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                                  Locked
                                </span>
                              ) : isDocChecked && !isBkashFifthDoc ? (
                                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                  Active
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 text-center text-xs space-y-1">
            <p className="font-bold text-blue-900">
              No Category Selected Yet
            </p>
            <p className="text-slate-600 max-w-xl mx-auto">
              Please click on any category above (Software, Website, SPG, SSL, or bKash) to enable aligned documents and input fields.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 1: Basic Institute Details (Institute Info) - ALWAYS VISIBLE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>1. Basic Institute Details (Institute Info)</span>
          </h3>
          <span className="text-[11px] text-slate-400">* Required fields (Always visible)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Institute Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.instituteName}
              onChange={(e) => handleChange('instituteName', e.target.value)}
              placeholder="Enter full institute name in English"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Institute Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.instituteAddress}
              onChange={(e) => handleChange('instituteAddress', e.target.value)}
              placeholder="Village/Road, Post Office, Union..."
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upazila / Thana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.upazilaThana}
              onChange={(e) => handleChange('upazilaThana', e.target.value)}
              placeholder="Upazila or Thana name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              placeholder="District name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Division <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.division}
              onChange={(e) => handleChange('division', e.target.value)}
              placeholder="Division name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Institute Type <span className="text-red-500">*</span>
              {isBkashSelected && (
                <span className="text-[10px] text-blue-600 font-normal ml-1">
                  (Private enables Board Directors for bKash)
                </span>
              )}
            </label>
            <select
              required
              value={formData.instituteType}
              onChange={(e) => handleChange('instituteType', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Govt">Govt (Government)</option>
              <option value="MPO">MPO (MPO Enrolled)</option>
              <option value="Private">Private {isBkashSelected ? '(Enables bKash Board Declaration & Directors)' : ''}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Education Board <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.educationBoard}
              onChange={(e) => handleChange('educationBoard', e.target.value)}
              placeholder="e.g. Dhaka Education Board"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Number of Students <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="300"
              required
              value={formData.studentCount}
              onChange={(e) => handleChange('studentCount', e.target.value)}
              placeholder="Minimum 300 students"
              className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                formData.studentCount !== '' && Number(formData.studentCount) < 300
                  ? 'border-red-500 focus:ring-red-500 bg-red-50/50 text-red-900 font-bold'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formData.studentCount !== '' && Number(formData.studentCount) < 300 && (
              <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Student count cannot be less than 300 (Minimum 300 students required).</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Number of Teachers <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.teacherCount}
              onChange={(e) => handleChange('teacherCount', e.target.value)}
              placeholder="Enter number of teachers"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Website Address <span className="text-red-500">*</span>
              <span className="text-[10px] text-slate-500 font-normal ml-1">(Default: pay.academyims.com)</span>
            </label>
            <input
              type="text"
              required
              value={formData.websiteAddress}
              onChange={(e) => handleChange('websiteAddress', e.target.value)}
              placeholder="pay.academyims.com"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Authority & Signatory Details (Authority Info) - ALWAYS VISIBLE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>2. Authority & Signatory Details (Authority Info)</span>
          </h3>
          <span className="text-[11px] text-amber-600 font-medium">
            * Provide Headmaster's details strictly as per NID card (Always visible)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Headmaster / Principal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.headName}
              onChange={(e) => handleChange('headName', e.target.value)}
              placeholder="Enter full name strictly as per NID card"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Note: Must strictly match NID card.</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Headmaster / Principal Date Of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.headDob}
              onChange={(e) => handleChange('headDob', e.target.value)}
              placeholder="DD/MM/YYYY (strictly as per NID)"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Note: Must strictly match NID card.</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Headmaster / Principal NID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.headNid}
              onChange={(e) => handleChange('headNid', e.target.value)}
              placeholder="NID Number"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              placeholder="Headmaster / Principal"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Institute Head Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.headMobile}
              onChange={(e) => handleChange('headMobile', e.target.value)}
              placeholder="01XXXXXXXXX"
              className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                formData.headMobile !== '' && !isValidBDMobile(formData.headMobile)
                  ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formData.headMobile !== '' && !isValidBDMobile(formData.headMobile) && (
              <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Institute Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.instituteEmail}
              onChange={(e) => handleChange('instituteEmail', e.target.value)}
              placeholder="institution@gmail.com"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institute Chairman Name (Optional)</label>
            <input
              type="text"
              value={formData.chairmanName}
              onChange={(e) => handleChange('chairmanName', e.target.value)}
              placeholder="Managing Committee Chairman Name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institute Chairman Mobile Number</label>
            <input
              type="text"
              value={formData.chairmanMobile}
              onChange={(e) => handleChange('chairmanMobile', e.target.value)}
              placeholder="01XXXXXXXXX"
              className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                formData.chairmanMobile !== '' && !isValidBDMobile(formData.chairmanMobile)
                  ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formData.chairmanMobile !== '' && !isValidBDMobile(formData.chairmanMobile) && (
              <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.</span>
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">ICT In-Charge Name (Optional)</label>
            <input
              type="text"
              value={formData.ictInchargeName}
              onChange={(e) => handleChange('ictInchargeName', e.target.value)}
              placeholder="ICT In-Charge Teacher Name"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">ICT In-Charge Mobile Number</label>
            <input
              type="text"
              value={formData.ictInchargeMobile}
              onChange={(e) => handleChange('ictInchargeMobile', e.target.value)}
              placeholder="01XXXXXXXXX"
              className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                formData.ictInchargeMobile !== '' && !isValidBDMobile(formData.ictInchargeMobile)
                  ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formData.ictInchargeMobile !== '' && !isValidBDMobile(formData.ictInchargeMobile) && (
              <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Board Directors Information (Visible ONLY for bKash Category + Private Institute) */}
      {isBoardDirectorsVisible && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>3. Board of Directors / Managing Committee Information</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mandatory for Private Institutions under bKash Category (Minimum 2 Directors required for bKash Declaration of Board Directors).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDirector}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Director</span>
            </button>
          </div>

          {/* Table of Directors */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                  <th className="p-2.5 w-12 text-center">SL</th>
                  <th className="p-2.5 min-w-[160px]">Name <span className="text-red-500">*</span></th>
                  <th className="p-2.5 min-w-[130px]">Date of Birth <span className="text-red-500">*</span></th>
                  <th className="p-2.5 min-w-[120px]">Nationality <span className="text-red-500">*</span></th>
                  <th className="p-2.5 min-w-[150px]">NID Number <span className="text-red-500">*</span></th>
                  <th className="p-2.5 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(formData.boardDirectors && formData.boardDirectors.length >= 2
                  ? formData.boardDirectors
                  : [createEmptyDirector(), createEmptyDirector()]
                ).map((director, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5 text-center font-bold text-slate-600">{idx + 1}</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required={formData.instituteType === 'Private'}
                        value={director.name}
                        onChange={(e) => handleDirectorChange(idx, 'name', e.target.value)}
                        placeholder="Director's Full Name"
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required={formData.instituteType === 'Private'}
                        value={director.dob}
                        onChange={(e) => handleDirectorChange(idx, 'dob', e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required={formData.instituteType === 'Private'}
                        value={director.nationality}
                        onChange={(e) => handleDirectorChange(idx, 'nationality', e.target.value)}
                        placeholder="e.g. Bangladeshi"
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required={formData.instituteType === 'Private'}
                        value={director.nid}
                        onChange={(e) => handleDirectorChange(idx, 'nid', e.target.value)}
                        placeholder="NID Number"
                        className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      {(formData.boardDirectors || []).length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDirector(idx)}
                          title="Delete Director"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: Bank Account Details (Visible for SPG / SSL / bKash PayBill) */}
      {isBankDetailsVisible && (
        <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-2xl p-6 border border-indigo-200 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-indigo-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-2">
              <Banknote className="w-5 h-5 text-indigo-600" />
              <span>4. Bank Account Details (For SPG / SSL / bKash Fund Settlement)</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-200/80 text-indigo-900 font-semibold px-2.5 py-1 rounded-lg">
                {formData.bankAccounts && formData.bankAccounts.length > 1
                  ? `Total ${formData.bankAccounts.length} Bank Accounts`
                  : 'For Fund Settlement'}
              </span>
            </div>
          </div>

          <div className="text-xs text-indigo-900 bg-indigo-100/80 border border-indigo-200 rounded-xl p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Rules:</strong> Required for Sonali Payment Gateway (SPG), SSLCOMMERZ Merchant Enrolment, and bKash Direct Settlement. If bank details are filled, ensure all fields for that account are completed accurately.</span>
          </div>

          {/* List of Bank Accounts */}
          <div className="space-y-6">
            {(formData.bankAccounts && formData.bankAccounts.length > 0
              ? formData.bankAccounts
              : [{ ...emptyBank }]
            ).map((bankAcc, index) => {
              const hasAnyVal = Boolean(
                (bankAcc.feeHeadName || '').trim() ||
                (bankAcc.bankName || '').trim() ||
                (bankAcc.accountName || '').trim() ||
                (bankAcc.accountNumber || '').trim() ||
                (bankAcc.branchName || '').trim() ||
                (bankAcc.routingNumber || '').trim() ||
                (bankAcc.bankAddress || '').trim()
              );
              const hasAllVal = Boolean(
                (bankAcc.feeHeadName || '').trim() &&
                (bankAcc.bankName || '').trim() &&
                (bankAcc.accountName || '').trim() &&
                (bankAcc.accountNumber || '').trim() &&
                (bankAcc.branchName || '').trim() &&
                (bankAcc.routingNumber || '').trim() &&
                (bankAcc.bankAddress || '').trim()
              );
              const isPartial = hasAnyVal && !hasAllVal;

              return (
                <div
                  key={index}
                  className={`bg-white/90 rounded-2xl p-5 border shadow-sm space-y-4 transition-all ${
                    isPartial ? 'border-amber-300 ring-2 ring-amber-200/50' : 'border-indigo-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-indigo-950 text-xs sm:text-sm">
                        {index === 0
                          ? 'Account #1 (Primary Settlement Bank Account)'
                          : `Account #${index + 1} (Designated Split Fee Head Account)`}
                      </h4>
                    </div>

                    {formData.bankAccounts && formData.bankAccounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBankAccount(index)}
                        className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg font-medium border border-red-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  {isPartial && (
                    <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Warning: Bank details partially filled. Please complete all fields or leave entirely blank before submitting.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Fee Head / Fee Name
                      </label>
                      <input
                        type="text"
                        value={bankAcc.feeHeadName || ''}
                        onChange={(e) => handleBankChange(index, 'feeHeadName', e.target.value)}
                        placeholder="e.g. Tuition Fee / Exam Fee / Admission Fee / General Fee"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankAcc.bankName || ''}
                        onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                        placeholder="e.g. Sonali Bank PLC / Islami Bank"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={bankAcc.accountName || ''}
                        onChange={(e) => handleBankChange(index, 'accountName', e.target.value)}
                        placeholder="e.g. Model High School Account"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={bankAcc.accountNumber || ''}
                        onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                        placeholder="Digits only (e.g. 1234567890)"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        value={bankAcc.branchName || ''}
                        onChange={(e) => handleBankChange(index, 'branchName', e.target.value)}
                        placeholder="Branch Name (e.g. Main Branch)"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={bankAcc.routingNumber || ''}
                        onChange={(e) => handleBankChange(index, 'routingNumber', e.target.value)}
                        placeholder="9 digits (e.g. 245260726)"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">
                        Branch Address
                      </label>
                      <input
                        type="text"
                        value={bankAcc.bankAddress || ''}
                        onChange={(e) => handleBankChange(index, 'bankAddress', e.target.value)}
                        placeholder="Branch address details"
                        className="w-full border border-indigo-200 bg-white rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Account Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddBankAccount}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Another Bank Account</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: Modules Selection & Live Service Fee Calculator (Visible for Software Agreement or SPG Software Charge) */}
      {isSoftwareModuleVisible && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>5. Module Selection & Service Charge Calculation</span>
            </h3>
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              Live Fee Calculator
            </div>
          </div>

          {/* Service Charge Calculation Method Selection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Service Charge Calculation Method</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choose one primary method (Method 1, 2, or 4). Method 3 (Per Transaction Fixed Rate) can be enabled as an add-on with any method.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto font-sans">
                {formData.chargeMethod === 'transaction_percentage'
                  ? '2. Per Transaction Percentage'
                  : formData.chargeMethod === 'monthly_charge'
                  ? '4. Monthly Fixed Charge'
                  : '1. Module-wise Charge'}
              </span>
            </div>

            {/* Primary Method Selection Radio Cards */}
            <div className="space-y-3">
              {/* Option 1: Module-wise Charge */}
              <div
                onClick={() => handleChange('chargeMethod', 'module_wise')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left ${
                  formData.chargeMethod === 'module_wise' || !formData.chargeMethod
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-colors ${
                      formData.chargeMethod === 'module_wise' || !formData.chargeMethod
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {(formData.chargeMethod === 'module_wise' || !formData.chargeMethod) && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          1. Module Wise Charge
                        </h5>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          Standard
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Default formula: <strong>৳40</strong> for the 1st selected optional module + <strong>৳15</strong> for each additional optional module. Alternatively, you can override with a customized fixed amount (Minimum ৳40).
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs sm:text-sm text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs shrink-0">
                    ৳{formData.customModuleWiseFee || formData.calculatedServiceCharge || 0}
                  </span>
                </div>

                {/* Custom Override Option for Module Wise Charge */}
                {(formData.chargeMethod === 'module_wise' || !formData.chargeMethod) && (
                  <div className="mt-3 pt-3 border-t border-blue-200/60 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Override Custom Amount (Optional - BDT)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">৳</span>
                        <input
                          type="number"
                          min="40"
                          value={formData.customModuleWiseFee || ''}
                          onChange={(e) => handleChange('customModuleWiseFee', e.target.value)}
                          placeholder="e.g. 50 (Min ৳40)"
                          className={`w-full border rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white ${
                            formData.customModuleWiseFee && Number(formData.customModuleWiseFee) < 40
                              ? 'border-red-500 focus:ring-red-500 bg-red-50'
                              : 'border-slate-300 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formData.customModuleWiseFee && Number(formData.customModuleWiseFee) < 40 ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Minimum charge is ৳40. Amount cannot be lower.</span>
                        </span>
                      ) : (
                        <span>Leave empty to use formula calculation: ৳40 (1st module) + ৳15 (each next).</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Per Transaction Percentage */}
              <div
                onClick={() => handleChange('chargeMethod', 'transaction_percentage')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left ${
                  formData.chargeMethod === 'transaction_percentage'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-colors ${
                      formData.chargeMethod === 'transaction_percentage'
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {formData.chargeMethod === 'transaction_percentage' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          2. Per Transaction Percentage
                        </h5>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Percentage
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        A fixed percentage service charge on the collected transaction amount (Minimum 0.03%).
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs sm:text-sm text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs shrink-0">
                    {formData.transactionPercentage || 1.5}%
                  </span>
                </div>

                {formData.chargeMethod === 'transaction_percentage' && (
                  <div className="mt-3 pt-3 border-t border-blue-200/60 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Per Transaction Percentage Rate (%) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          min="0.03"
                          value={formData.transactionPercentage || ''}
                          onChange={(e) => handleChange('transactionPercentage', e.target.value)}
                          placeholder="e.g. 1.50 (Min 0.03%)"
                          className={`w-full border rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white ${
                            formData.transactionPercentage && Number(formData.transactionPercentage) < 0.03
                              ? 'border-red-500 focus:ring-red-500 bg-red-50'
                              : 'border-slate-300 focus:ring-blue-500'
                          }`}
                        />
                        <span className="absolute right-3 top-2 text-slate-400 font-bold text-xs">%</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formData.transactionPercentage && Number(formData.transactionPercentage) < 0.03 ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Percentage cannot be less than 0.03% (Minimum 0.03%).</span>
                        </span>
                      ) : (
                        <span>Default is 1.5%. Service fee will be deducted proportionally per online collection.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 4: Monthly Fixed Charge */}
              <div
                onClick={() => handleChange('chargeMethod', 'monthly_charge')}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left ${
                  formData.chargeMethod === 'monthly_charge'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-colors ${
                      formData.chargeMethod === 'monthly_charge'
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {formData.chargeMethod === 'monthly_charge' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          4. Monthly Fixed Charge
                        </h5>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                          Monthly
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Fixed monthly service charge for using the software (Minimum ৳1,000).
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs sm:text-sm text-purple-700 bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-xs shrink-0">
                    ৳{Number(formData.monthlyChargeAmount || 0).toLocaleString()}/mo
                  </span>
                </div>

                {formData.chargeMethod === 'monthly_charge' && (
                  <div className="mt-3 pt-3 border-t border-blue-200/60 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Monthly Fixed Amount (BDT) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">৳</span>
                        <input
                          type="number"
                          min="1000"
                          value={formData.monthlyChargeAmount || ''}
                          onChange={(e) => handleChange('monthlyChargeAmount', e.target.value)}
                          placeholder="e.g. 2000 (Min ৳1,000)"
                          className={`w-full border rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white ${
                            formData.monthlyChargeAmount && Number(formData.monthlyChargeAmount) < 1000
                              ? 'border-red-500 focus:ring-red-500 bg-red-50'
                              : 'border-slate-300 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formData.monthlyChargeAmount && Number(formData.monthlyChargeAmount) < 1000 ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Monthly fee cannot be less than ৳1,000 (Minimum ৳1,000).</span>
                        </span>
                      ) : (
                        <span>The institution will pay this fixed software maintenance fee on a monthly billing basis.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Option 3: Per Transaction Fixed Rate (Add-on Option) */}
            <div className="pt-2">
              <div
                onClick={() => {
                  const updated = {
                    ...formData,
                    enablePerTransactionRate: !formData.enablePerTransactionRate
                  };
                  setFormData(updated);
                  if (onPreviewDataChange) onPreviewDataChange(updated);
                }}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-left ${
                  formData.enablePerTransactionRate
                    ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-colors ${
                      formData.enablePerTransactionRate
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}>
                      {formData.enablePerTransactionRate && (
                        <CheckSquare className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          3. Per Transaction Fixed Rate (Optional Add-on)
                        </h5>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Add-on Rate
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        A fixed Taka amount per transaction that can be enabled alongside any primary method (Minimum ৳3).
                      </p>
                    </div>
                  </div>

                  <span className={`font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-lg border shadow-xs shrink-0 ${
                    formData.enablePerTransactionRate
                      ? 'bg-white text-amber-800 border-amber-300'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}>
                    {formData.enablePerTransactionRate ? `+ ৳${formData.perTransactionRateAmount || 3}/trx` : 'Disabled'}
                  </span>
                </div>

                {formData.enablePerTransactionRate && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 pl-8 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Per Transaction Fixed Amount (BDT) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">৳</span>
                        <input
                          type="number"
                          min="3"
                          value={formData.perTransactionRateAmount || ''}
                          onChange={(e) => handleChange('perTransactionRateAmount', e.target.value)}
                          placeholder="e.g. 3 (Min ৳3)"
                          className={`w-full border rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white ${
                            formData.perTransactionRateAmount && Number(formData.perTransactionRateAmount) < 3
                              ? 'border-red-500 focus:ring-red-500 bg-red-50'
                              : 'border-slate-300 focus:ring-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formData.perTransactionRateAmount && Number(formData.perTransactionRateAmount) < 3 ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Per transaction fixed amount cannot be less than ৳3 (Minimum ৳3).</span>
                        </span>
                      ) : (
                        <span>Will be added on top of the primary calculation method.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Base Modules */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Base Modules (Included by Default - 11 Modules)</span>
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Always Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {BASE_MODULES.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 text-slate-700"
                >
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium truncate">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Modules */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <span>Optional Modules (Select as needed)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Rule: First selected optional module is <strong>৳40 (Forty Taka)</strong> and each additional module adds <strong>৳15 (Fifteen Taka)</strong> service charge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {OPTIONAL_MODULES.map((m, idx) => {
                const isSelected = formData.selectedOptionalModules.includes(m);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleOptionalModule(m)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-950 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{m}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realtime Service Charge Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  Method:{' '}
                  <strong className="text-white font-semibold">
                    {formData.chargeMethod === 'transaction_percentage'
                      ? 'Per Transaction Percentage'
                      : formData.chargeMethod === 'monthly_charge'
                      ? 'Monthly Fixed Charge'
                      : 'Module Wise Charge'}
                  </strong>
                </span>
                {formData.enablePerTransactionRate && formData.perTransactionRateAmount && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
                    + ৳{formData.perTransactionRateAmount}/trx
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {formData.chargeMethod === 'transaction_percentage'
                  ? `Service charge is set to ${formData.transactionPercentage || 1.5}% on collected transaction amounts.`
                  : formData.chargeMethod === 'monthly_charge'
                  ? `Fixed monthly software service fee of ৳${Number(formData.monthlyChargeAmount || formData.calculatedServiceCharge || 0).toLocaleString()} applies to the institution.`
                  : formData.customModuleWiseFee && Number(formData.customModuleWiseFee) > 0
                  ? `Customized service charge of ৳${formData.customModuleWiseFee} is configured.`
                  : formData.selectedOptionalModules.length === 0
                  ? 'No optional modules selected (Service Charge ৳0)'
                  : formData.selectedOptionalModules.length === 1
                  ? '1st optional module fee = ৳40'
                  : `1st module ৳40 + remaining ${formData.selectedOptionalModules.length - 1} modules × ৳15 = ৳${formData.calculatedServiceCharge}`}
              </p>
            </div>

            <div className="bg-blue-600/30 border border-blue-400/30 px-6 py-3 rounded-xl text-center shrink-0">
              <span className="block text-[10px] text-blue-200 uppercase font-semibold">Effective Service Charge</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {formData.chargeMethod === 'transaction_percentage'
                  ? `${formData.transactionPercentage || 1.5}%`
                  : formData.chargeMethod === 'monthly_charge'
                  ? `৳${Number(formData.monthlyChargeAmount || formData.calculatedServiceCharge || 0).toLocaleString()}`
                  : `৳${formData.customModuleWiseFee || formData.calculatedServiceCharge || 0}`}
              </span>
              <span className="text-[10px] text-slate-300 block">
                {formData.chargeMethod === 'transaction_percentage'
                  ? '/ per transaction'
                  : formData.chargeMethod === 'monthly_charge'
                  ? '/ per month'
                  : '/ student or module'}
                {formData.enablePerTransactionRate && formData.perTransactionRateAmount && ` (+ ৳${formData.perTransactionRateAmount}/trx)`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: Website Configuration & Pricing (Visible for Website Work Order or Software Agreement) */}
      {isWebsiteConfigVisible && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>6. Website Charges & Domain Configuration</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedDocs.includes('website_work_order')
                  ? 'Mandatory for Website Work Order (Min 1st Year: ৳8,000, Min Renewal: ৳4,000)'
                  : 'Optional for Software Agreement (খালি রাখা যাবে, তবে পূরণ করলে ১ম বছর নূন্যতম ৳৮,০০০ ও বাৎসরিক রিনিউ নূন্যতম ৳৪,০০০ হতে হবে)'}
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
              {selectedDocs.includes('website_work_order') ? 'Website Work Order' : 'Software Agreement'} Setup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                1st Year Charge (Domain, Hosting, Design & Development) (BDT)
                {selectedDocs.includes('website_work_order') ? (
                  <span className="text-red-500 ml-1">* (Min. ৳8,000)</span>
                ) : (
                  <span className="text-slate-400 font-normal ml-1">(Optional / Min. ৳8,000 if entered)</span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">৳</span>
                <input
                  type="text"
                  required={selectedDocs.includes('website_work_order')}
                  value={formData.websiteFirstYearFee || ''}
                  onChange={(e) => handleChange('websiteFirstYearFee', sanitizeInput(e.target.value))}
                  placeholder="e.g. 15000 (Min. ৳8,000)"
                  className={`w-full border rounded-xl pl-8 pr-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white transition-colors ${
                    selectedDocs.includes('website_work_order') && (!formData.websiteFirstYearFee || Number(formData.websiteFirstYearFee) < 8000)
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : formData.websiteFirstYearFee && Number(formData.websiteFirstYearFee) < 8000
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/40'
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {formData.websiteFirstYearFee && Number(formData.websiteFirstYearFee) < 8000 ? (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>1st Year Charge ৮,০০০ টাকার নিচে লেখা যাবে না (নূন্যতম ৳৮,০০০)।</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 mt-1">
                  First year total charge for domain, hosting, dynamic web portal design & development (নূন্যতম ৳৮,০০০)।
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Yearly Renewal Charge (Annual renewal fee from 2nd year onwards) (BDT)
                {selectedDocs.includes('website_work_order') ? (
                  <span className="text-red-500 ml-1">* (Min. ৳4,000)</span>
                ) : (
                  <span className="text-slate-400 font-normal ml-1">(Optional / Min. ৳4,000 if entered)</span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">৳</span>
                <input
                  type="text"
                  required={selectedDocs.includes('website_work_order')}
                  value={formData.websiteRenewalFee || ''}
                  onChange={(e) => handleChange('websiteRenewalFee', sanitizeInput(e.target.value))}
                  placeholder="e.g. 5000 (Min. ৳4,000)"
                  className={`w-full border rounded-xl pl-8 pr-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 bg-white transition-colors ${
                    selectedDocs.includes('website_work_order') && (!formData.websiteRenewalFee || Number(formData.websiteRenewalFee) < 4000)
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : formData.websiteRenewalFee && Number(formData.websiteRenewalFee) < 4000
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/40'
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {formData.websiteRenewalFee && Number(formData.websiteRenewalFee) < 4000 ? (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Yearly Renewal Charge ৪,০০০ টাকার নিচে লেখা যাবে না (নূন্যতম ৳৪,০০০)।</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 mt-1">
                  Annual renewal fee for domain, server hosting & security maintenance (নূন্যতম ৳৪,০০০)।
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: bKash Specific Mobile Numbers (Visible for bKash PayBill or Dynamic Charging) */}
      {isBkashNumbersVisible && (
        <div className="bg-pink-50/60 rounded-2xl p-6 border border-pink-200 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-pink-200 pb-3">
            <Phone className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-pink-900 text-sm uppercase tracking-wider">
              7. bKash Payment Accounts (bKash Mobile Accounts)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {selectedDocs.includes('paybill') && (
              <div>
                <label className="block font-semibold text-pink-950 mb-1">
                  PayBill Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.payBillNumber}
                  onChange={(e) => handleChange('payBillNumber', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                    formData.payBillNumber !== '' && !isValidBDMobile(formData.payBillNumber)
                      ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                      : 'border-pink-300 focus:ring-pink-500 bg-white'
                  }`}
                />
                <p className="text-[11px] text-pink-700 mt-1 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-pink-600" />
                  <span>Must be a mobile number without an existing bKash personal account</span>
                </p>
                {formData.payBillNumber !== '' && !isValidBDMobile(formData.payBillNumber) && (
                  <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.</span>
                  </p>
                )}
              </div>
            )}

            {selectedDocs.includes('dynamic_charging') && (
              <div>
                <label className="block font-semibold text-pink-950 mb-1">
                  Dynamic Charge Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.dynamicChargeNumber}
                  onChange={(e) => handleChange('dynamicChargeNumber', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full border rounded-xl px-3.5 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 transition-colors ${
                    formData.dynamicChargeNumber !== '' && !isValidBDMobile(formData.dynamicChargeNumber)
                      ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                      : 'border-pink-300 focus:ring-pink-500 bg-white'
                  }`}
                />
                <p className="text-[11px] text-pink-700 mt-1 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-pink-600" />
                  <span>Must be a mobile number without an existing bKash personal account</span>
                </p>
                {formData.dynamicChargeNumber !== '' && !isValidBDMobile(formData.dynamicChargeNumber) && (
                  <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Submission Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Upon submission, data will be saved and {selectedDocs.length > 0 ? selectedDocs.length : 'all'} official PDF documents will be generated.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Submit & Generate Documents</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
