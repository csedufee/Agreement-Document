import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const SPGVendorChangeDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const designation = data.designation || 'প্রধান শিক্ষক / অধ্যক্ষ';
  const instituteName = data.instituteName || '—';
  
  const bankName = data.bankDetails?.bankName || data.bankAccounts?.[0]?.bankName || 'সোনালী ব্যাংক পিএলসি';
  const branchName = data.bankDetails?.branchName || data.bankAccounts?.[0]?.branchName || '—';
  const branchAddress = data.bankDetails?.bankAddress || data.bankAccounts?.[0]?.bankAddress || data.instituteAddress || '—';

  const headName = data.headName || '—';

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
          তারিখ: {data.date}
        </div>
      )}

      {/* Recipient / Address */}
      <div className="mb-6 space-y-1 text-xs text-black leading-relaxed">
        <p className="font-semibold text-black">বরাবর,</p>
        <div className="pl-4 space-y-0.5 mt-1">
          <p className="font-bold text-black">ব্যবস্থাপক, সোনালী ব্যাংক পিএলসি</p>
          <p className="font-medium text-black">{branchName}</p>
          <p className="text-black">{branchAddress}</p>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-6 font-bold text-xs sm:text-sm text-black pb-1.5">
        বিষয়: সোনালী পেমেন্ট গেটওয়ের মাধ্যমে কলেজ ফি আদায়ের জন্য ভেন্ডর প্রতিষ্ঠান এসাইন প্রসঙ্গে।
      </div>

      {/* Body Content */}
      <div className="space-y-4 text-justify text-xs leading-relaxed text-black">
        <p className="indent-6">
          উপরোক্ত বিষয়ের প্রেক্ষিতে আপনার সদয় অবগতির জন্য জানানো যাচ্ছে যে, <span className="font-bold text-black">{instituteName}</span> শিক্ষার্থীদের বিভিন্ন ফি সোনালী পেমেন্ট গেটওয়ের মাধ্যমে আদায় করতে আমরা অটোমেট আইটি লিমিটেড এর সফটওয়্যার সার্ভিসটি ব্যবহার করার সিদ্ধান্ত নিয়েছি।
        </p>

        <p className="indent-6">
          অতএব অত্র কলেজের ছাত্রীদের সকল ধরনের ফি অটোমেট আইটি লিমিটেড এর সফটওয়্যার সিস্টেম ব্যবহার করে আদায়ের জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণের অনুরোধ করা হলো।
        </p>
      </div>

      {/* Signature & Details */}
      <div className="pt-12 mt-8 max-w-xs text-black">
        <div className="space-y-0.5">
          <p className="font-bold text-sm text-black">{headName}</p>
          <p className="text-black font-medium">{designation}</p>
          <p className="text-black font-semibold">{instituteName}</p>
        </div>
      </div>

      {/* CC / Onulipi (অনুলিপি) */}
      <div className="mt-10 pt-4 text-xs text-black">
        <p className="font-bold mb-2">অনুলিপি:</p>
        <ol className="list-none space-y-1 pl-2 text-black">
          <li>১। অফিস কপি।</li>
          <li>২। {bankName}, {branchName}।</li>
          <li>৩। অটোমেট আইটি লিমিটেড।</li>
        </ol>
      </div>
    </div>
  );
};
