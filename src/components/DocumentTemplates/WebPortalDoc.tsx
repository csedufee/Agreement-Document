import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const WebPortalDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-6 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-sm font-bold uppercase tracking-wide inline-block text-black">
          Signup Portal Update Request
        </h1>
      </div>

      {/* Letter Body */}
      <div className="space-y-4 text-xs leading-relaxed max-w-xl mx-auto pt-2 text-black">
        <p>Dear Concern,</p>
        <p className="text-justify text-sm text-black">
          I am <span className="font-bold text-black">{data.headName || '—'}</span> from <span className="font-bold text-black">{data.instituteName || '—'}</span> are requested to update the signup portal on behalf of me.
        </p>

        <p className="pt-4 text-black">Yours faithfully,</p>

        {/* Signature Line */}
        <div className="pt-10 mt-6 max-w-xs text-black">
          <p className="font-bold text-sm text-black">{data.headName || '—'}</p>
          <p className="text-black font-medium">Title: {data.designation || '—'}</p>
          <p className="text-black font-semibold">{data.instituteName || '—'}</p>
        </div>
      </div>
    </div>
  );
};
