import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const WebPortalDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-gray-900 font-sans text-xs leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-10 flex items-center justify-center text-gray-400 text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-lg font-bold uppercase tracking-wide border-b-2 border-gray-800 pb-2 inline-block">
          Signup Portal Update Request
        </h1>
      </div>

      {/* Letter Body */}
      <div className="space-y-6 text-sm leading-relaxed max-w-xl mx-auto pt-4">
        <p>Dear Concern,</p>
        <p className="text-justify font-serif text-base">
          I am <span className="font-bold underline decoration-blue-500">{data.headName || '—'}</span> from <span className="font-bold underline decoration-blue-500">{data.instituteName || '—'}</span> are requested to update the signup portal on behalf of me.
        </p>

        <p className="pt-8">Yours faithfully,</p>

        {/* Signature Line */}
        <div className="pt-16 mt-8 border-t-2 border-gray-800 max-w-sm">
          <p className="font-bold text-base">{data.headName || '—'}</p>
          <p className="text-gray-700 font-medium">Title: {data.designation || '—'}</p>
          <p className="text-gray-900 font-semibold">{data.instituteName || '—'}</p>
          <p className="text-xs text-gray-400 mt-2">[ Signature & Official Stamp ]</p>
        </div>
      </div>
    </div>
  );
};
