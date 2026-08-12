import React, { useState, useEffect } from 'react';
import { 
  Building, User, Phone, Mail, MapPin, Calendar, CreditCard, 
  CheckSquare, Square, Layers, Sparkles, AlertCircle, Save, Info,
  Banknote, ShieldAlert, Plus, Trash2
} from 'lucide-react';
import { BankDetails, InstituteAgreementData } from '../types';
import { BASE_MODULES, OPTIONAL_MODULES, calculateServiceCharge, getCurrentFormattedDate } from '../data/modules';

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

  const getInitialBankAccounts = (data?: InstituteAgreementData | null): BankDetails[] => {
    if (data?.bankAccounts && data.bankAccounts.length > 0) {
      return data.bankAccounts;
    }
    if (data?.bankDetails && (data.bankDetails.bankName || data.bankDetails.accountNumber)) {
      return [data.bankDetails];
    }
    return [{ ...emptyBank }];
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
    calculatedServiceCharge: 0
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate initial data when editing or loaded from search
  useEffect(() => {
    if (initialData) {
      const bankAccountsList = getInitialBankAccounts(initialData);
      setFormData({
        ...initialData,
        date: initialData.date || currentDateStr,
        websiteAddress: initialData.websiteAddress || 'pay.academyims.com',
        baseModules: initialData.baseModules && initialData.baseModules.length > 0 
          ? initialData.baseModules 
          : [...BASE_MODULES],
        bankAccounts: bankAccountsList,
        bankDetails: bankAccountsList[0] || { ...emptyBank }
      });
    }
  }, [initialData]);

  // Recalculate service charge whenever optional modules change
  useEffect(() => {
    const fee = calculateServiceCharge(formData.selectedOptionalModules.length);
    const updated = {
      ...formData,
      calculatedServiceCharge: fee
    };
    if (JSON.stringify(updated.selectedOptionalModules) !== JSON.stringify(formData.selectedOptionalModules) || formData.calculatedServiceCharge !== fee) {
      setFormData(updated);
    }
    if (onPreviewDataChange) {
      onPreviewDataChange(updated);
    }
  }, [formData.selectedOptionalModules]);

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
    // First convert any Bangla digits to English digits
    let converted = banglaToEnglishDigits(val);
    // Strip out any Bangla characters
    return converted.replace(/[\u0980-\u09FF]/g, '');
  };

  const numberFields: (keyof InstituteAgreementData)[] = [
    'headMobile',
    'chairmanMobile',
    'ictInchargeMobile',
    'payBillNumber',
    'dynamicChargeNumber',
    'studentCount',
    'teacherCount',
    'headNid'
  ];

  const handleChange = (field: keyof InstituteAgreementData, value: any) => {
    let val = value;
    if (typeof val === 'string') {
      val = sanitizeInput(val);
    }
    const updated = { ...formData, [field]: val };
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
    const fee = calculateServiceCharge(current.length);
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

  // Mobile number validation helper: BD series (013, 014, 015, 016, 017, 018, 019) and exactly 11 digits
  const isValidBDMobile = (mobile: string) => {
    if (!mobile) return false;
    return /^01[3-9]\d{8}$/.test(mobile.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

    // Validation Section 1
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
    if (!formData.headName.trim()) {
      setError('Headmaster / Principal Name (as per NID) is required.');
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
    if (!formData.payBillNumber.trim()) {
      setError('PayBill Mobile Number is required.');
      return;
    }
    if (!isValidBDMobile(formData.payBillNumber)) {
      setError('PayBill Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
      return;
    }
    if (!formData.dynamicChargeNumber.trim()) {
      setError('Dynamic Charge Mobile Number is required.');
      return;
    }
    if (!isValidBDMobile(formData.dynamicChargeNumber)) {
      setError('Dynamic Charge Mobile Number must be 11 English digits starting with 013, 014, 015, 016, 017, 018, or 019.');
      return;
    }

    // Validation Section 4: Bank Account Details
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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            <span>Educational Institution Details & Service Agreement Form</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please fill out all required information accurately in English to complete the agreement with Automate IT Limited.
          </p>
        </div>

        <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs text-slate-700 flex items-center gap-2 font-mono border border-slate-200">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Date: <strong className="text-slate-900">{formData.date}</strong> (Auto)</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* SECTION 1: Institute Primary Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>1. Basic Institute Details (Institute Info)</span>
          </h3>
          <span className="text-[11px] text-slate-400">* Required fields</span>
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
            </label>
            <select
              required
              value={formData.instituteType}
              onChange={(e) => handleChange('instituteType', e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Govt">Govt (Government)</option>
              <option value="MPO">MPO (MPO Enrolled)</option>
              <option value="Private">Private</option>
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

      {/* SECTION 2: Authority & Signatory Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>2. Authority & Signatory Details (Authority Info)</span>
          </h3>
          <span className="text-[11px] text-amber-600 font-medium">
            * Provide Headmaster's details strictly as per NID card
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

      {/* SECTION 3: bKash Specific Numbers */}
      <div className="bg-pink-50/60 rounded-2xl p-6 border border-pink-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-pink-200 pb-3">
          <Phone className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-pink-900 text-sm uppercase tracking-wider">
            3. bKash Payment Accounts (bKash Mobile Accounts)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
        </div>
      </div>

      {/* SECTION 4: Bank Account Details */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-2xl p-6 border border-indigo-200 space-y-6 shadow-sm">
        <div className="border-b border-indigo-200 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-indigo-950 text-sm uppercase tracking-wider flex items-center gap-2">
            <Banknote className="w-5 h-5 text-indigo-600" />
            <span>4. Bank Account Details (For Fund Settlement)</span>
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
          <span><strong>Rules:</strong> If you do not wish to provide bank details, you may leave these fields blank. However, if any field is filled, all fields for that bank account (Fee Head, Bank Name, Account Name, Account Number, Branch Name, Routing Number, and Branch Address) must be completed.</span>
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
                        ? 'Account #1 (Primary Bank Account)'
                        : `Account #${index + 1}`}
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
                    placeholder="e.g. Islami Bank Bangladesh PLC / Sonali Bank"
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

      {/* SECTION 5: Modules Selection & Live Service Fee Calculator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>5. Module Selection & Service Charge Calculation</span>
          </h3>
          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Live Fee Calculator
          </div>
        </div>

        {/* Base Modules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <span>Base Modules (Included - Service Charge ৳0)</span>
            </h4>
            <span className="text-[11px] text-emerald-600 font-semibold">Included by default, Free</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            {BASE_MODULES.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2 text-slate-700 select-none opacity-90"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">{m}</span>
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
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Selected Optional Modules: <strong className="text-white text-sm font-mono">{formData.selectedOptionalModules.length}</strong></span>
            </div>
            <p className="text-[11px] text-slate-400">
              {formData.selectedOptionalModules.length === 0
                ? 'No optional modules selected (Service Charge ৳0)'
                : formData.selectedOptionalModules.length === 1
                ? '1st Module Fee = ৳40'
                : `1st Module ৳40 + remaining ${formData.selectedOptionalModules.length - 1} modules × ৳15 = ৳${formData.calculatedServiceCharge}`}
            </p>
          </div>

          <div className="bg-blue-600/30 border border-blue-400/30 px-6 py-3 rounded-xl text-center">
            <span className="block text-[10px] text-blue-200 uppercase font-semibold">Calculated Service Charge</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              ৳{formData.calculatedServiceCharge}
            </span>
            <span className="text-[10px] text-slate-300 block">/ per student or module</span>
          </div>
        </div>
      </div>

      {/* Form Submission Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Upon submission, data will be saved on the server and 8 official PDFs will be generated.
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
              <span>Submit Agreement Details</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
