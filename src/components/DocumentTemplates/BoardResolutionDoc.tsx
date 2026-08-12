import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const BoardResolutionDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-gray-900 font-sans text-xs leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-8 flex items-center justify-center text-gray-400 text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-4">
        <p className="font-bold">To,</p>
        <p className="font-bold">Head of Education Payment</p>
        <p className="font-bold">bKash Limited</p>
        <p>Bir Sreshtha Shaheed Jahangir Gate</p>
        <p>546, Dhaka Cantonment, Dhaka-1206</p>
      </div>

      <div className="mb-4 font-semibold text-gray-700">
        Attention: Naimul Hossain Durjoy, Business Development Executive
      </div>

      <div className="mb-6 font-bold text-sm bg-gray-50 p-3 rounded border border-gray-300">
        Subject: Board Resolution & Authorization
      </div>

      <div className="space-y-6 text-justify leading-relaxed">
        <p>Dear Concern,</p>
        <p className="text-sm">
          With reference to a meeting that was held on <span className="font-bold">{data.date || '08/08/2026'}</span>, it has been decided that we, <span className="font-bold text-gray-900">{data.instituteName || '—'}</span>, will open a bKash collection account for the collection of various types of fees. The signatory of the account will be <span className="font-bold text-gray-900">{data.headName || '—'}</span>, <span className="font-semibold">{data.designation || '—'}</span>.
        </p>

        <p>Kindly do the needful on your end to activate a bKash collection account.</p>

        <p className="pt-4">Thanking You,</p>

        {/* Signature */}
        <div className="pt-16 border-t border-gray-400 max-w-xs mt-12">
          <p className="font-bold text-sm">Name: {data.headName || '—'}</p>
          <p className="text-gray-700 font-medium">Designation: {data.designation || '—'}</p>
          <p className="font-semibold text-gray-900">{data.instituteName || '—'}</p>
          <p className="text-xs text-gray-400 mt-2">[ Signature & Official Seal ]</p>
        </div>
      </div>
    </div>
  );
};
