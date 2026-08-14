import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const BoardResolutionDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-3 text-black text-xs">
        <p className="font-bold">To,</p>
        <p className="font-bold">Head of Education Payment</p>
        <p className="font-bold">bKash Limited</p>
        <p>Bir Sreshtha Shaheed Jahangir Gate</p>
        <p>546, Dhaka Cantonment, Dhaka-1206</p>
      </div>

      <div className="mb-3 font-semibold text-black text-xs">
        Attention: Naimul Hossain Durjoy, Business Development Executive
      </div>

      <div className="mb-4 font-bold text-xs bg-white p-2 rounded border border-black text-black">
        Subject: Board Resolution & Authorization
      </div>

      <div className="space-y-4 text-justify leading-relaxed text-xs text-black">
        <p>Dear Concern,</p>
        <p className="text-xs">
          With reference to a meeting that was held on <span className="font-bold text-black">{data.date || '08/08/2026'}</span>, it has been decided that we, <span className="font-bold text-black">{data.instituteName || '—'}</span>, will open a bKash collection account for the collection of various types of fees. The signatory of the account will be <span className="font-bold text-black">{data.headName || '—'}</span>, <span className="font-semibold text-black">{data.designation || '—'}</span>.
        </p>

        <p>Kindly do the needful on your end to activate a bKash collection account.</p>

        <p className="pt-2">Thanking You,</p>

        {/* Signature */}
        <div className="pt-8 max-w-xs mt-6 text-black">
          <p className="font-bold text-xs">Name: {data.headName || '—'}</p>
          <p className="text-black font-medium">Designation: {data.designation || '—'}</p>
          <p className="font-semibold text-black">{data.instituteName || '—'}</p>
        </div>
      </div>
    </div>
  );
};
