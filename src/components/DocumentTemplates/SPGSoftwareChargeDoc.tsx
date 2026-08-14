import React from 'react';
import { InstituteAgreementData } from '../../types';
import { calculateServiceCharge } from '../../data/modules';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const SPGSoftwareChargeDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const designation = data.designation || 'Headmaster';
  const instituteName = data.instituteName || '—';
  
  // Calculate dynamic service charge description based on selected method
  let chargeAmount = '100 tk';
  if (data.chargeMethod === 'transaction_percentage') {
    chargeAmount = `${data.transactionPercentage || '1.5'}%`;
  } else if (data.chargeMethod === 'monthly_charge') {
    chargeAmount = `${data.monthlyChargeAmount || '5,000'} tk (monthly)`;
  } else {
    // Module wise (default)
    const baseAmt = (data.customModuleWiseFee && Number(data.customModuleWiseFee) > 0)
      ? data.customModuleWiseFee
      : (data.calculatedServiceCharge && data.calculatedServiceCharge > 0)
        ? data.calculatedServiceCharge
        : calculateServiceCharge(data.selectedOptionalModules?.length || 0) || 100;
    chargeAmount = `${baseAmt} tk`;
  }

  if (data.enablePerTransactionRate && data.perTransactionRateAmount) {
    chargeAmount += ` + ${data.perTransactionRateAmount} tk per transaction`;
  }

  const branchName = data.bankDetails?.branchName || data.bankAccounts?.[0]?.branchName || '—';
  const district = data.district || '';
  const branchInfo = district 
    ? `${branchName} Branch, ${district}.` 
    : `${branchName} Branch.`;

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-6 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Date Header if available */}
      {data.date && (
        <div className="text-right text-xs mb-4 text-black font-mono">
          Date: {data.date}
        </div>
      )}

      {/* Recipient */}
      <div className="mb-5 space-y-0.5 text-xs text-black leading-relaxed">
        <p className="font-bold text-black">To</p>
        <p className="font-bold text-black">The Deputy General Manager (DGM)</p>
        <p className="font-semibold text-black">Govt. Accounts & Service Division</p>
        <p className="text-black">Sonali Bank PLC</p>
        <p className="text-black">Head Office, Dhaka.</p>
      </div>

      {/* Subject */}
      <div className="mb-5 font-bold text-xs sm:text-sm text-black leading-snug">
        Subject: Request for Approval to Deduct Software Service Charge Along with Online Fee Collection through Sonali Bank Payment Gateway.
      </div>

      {/* Salutation */}
      <div className="mb-4 text-xs font-semibold text-black">
        Respected Sir,
      </div>

      {/* Body Content */}
      <div className="space-y-4 text-justify text-xs leading-relaxed text-black">
        <p>
          With due respect, we would like to inform you that our institution has implemented an <span className="font-bold">Institute Management Software</span> developed by <span className="font-bold">Automate IT Limited</span> to facilitate digital operations. Alongside online fee collection through Sonali Bank Payment Gateway, this software is also being used to manage examinations, attendance, and other administrative activities of our institution.
        </p>

        <p>
          As per agreement with Automate IT Limited, a <span className="font-bold">{chargeAmount} tk</span> service charge on the collected fees will be applicable for the usage and maintenance of the software system. It is to be mentioned that this <span className="font-bold">{chargeAmount} tk</span> is a Software Service Charge, which is completely separate from the MFS charges of the Sonali Bank Payment Gateway. The existing MFS charges will remain unchanged.
        </p>

        <p>
          Therefore, we kindly request your approval to directly transfer the said <span className="font-bold">{chargeAmount} tk</span> service charge from each transaction to the designated bank account of Automate IT Limited, while the remaining collected fees will be deposited into our institution’s account as usual.
        </p>

        {/* Bank Account Details of Automate IT Limited */}
        <div className="pt-1">
          <p className="font-medium text-xs mb-2">The designated bank account details of Automate IT Limited are as follows:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-black">
            <li><span className="font-bold">Bank Name:</span> Sonali Bank PLC</li>
            <li><span className="font-bold">Bank Account Name:</span> Automate IT Limited</li>
            <li><span className="font-bold">Account No.:</span> 1614702000732</li>
            <li><span className="font-bold">Routing No.:</span> 200275743</li>
          </ul>
        </div>

        <p className="pt-1">
          We sincerely hope for your kind cooperation in this regard.
        </p>

        {/* Closing & Signature */}
        <div className="pt-6">
          <p className="mb-8 font-medium">Sincerely yours,</p>
          
          <div className="space-y-0.5 text-xs text-black max-w-sm">
            <p className="font-bold text-black">{designation}</p>
            <p className="font-semibold text-black">{instituteName}</p>
          </div>
        </div>

        {/* Copy to List */}
        <div className="pt-6 text-xs text-black leading-relaxed">
          <p className="font-bold mb-1">Copy to:</p>
          <ol className="list-none space-y-0.5 pl-1 text-black">
            <li>1. Office Copy.</li>
            <li>2. Manager, Sonali Bank PLC, {branchInfo}</li>
            <li>3. Manager, Business Operations, Automate IT Limited.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
