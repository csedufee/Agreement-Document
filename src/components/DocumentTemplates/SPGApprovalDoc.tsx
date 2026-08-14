import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const SPGApprovalDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const designation = data.designation || 'প্রধান শিক্ষক / অধ্যক্ষ';
  const instituteName = data.instituteName || '—';
  const instituteAddress = data.instituteAddress || '—';
  
  const bankName = data.bankDetails?.bankName || 'সোনালী ব্যাংক পিএলসি';
  const branchName = data.bankDetails?.branchName || 'শাখা';

  const headName = data.headName || '—';
  const headMobile = data.headMobile || '—';

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Sender (প্রেরক) */}
      <div className="mb-3 space-y-0.5 text-xs text-black">
        <p className="font-bold text-black text-[11px] uppercase tracking-wider mb-0.5">প্রেরকঃ</p>
        <p className="font-semibold text-black">{designation}</p>
        <p className="font-bold text-black">{instituteName}</p>
        <p className="text-black">{instituteAddress}</p>
      </div>

      {/* Recipient (প্রাপক) */}
      <div className="mb-4 space-y-0.5 text-xs text-black">
        <p className="font-bold text-black text-[11px] uppercase tracking-wider mb-0.5">প্রাপকঃ</p>
        <p className="font-bold text-black">ম্যানেজার</p>
        <p className="font-semibold text-black">{bankName}</p>
        <p className="text-black">{branchName}</p>
      </div>

      {/* Subject */}
      <div className="mb-4 font-bold text-sm text-black">
        বিষয়ঃ সম্মতিপত্র।
      </div>

      {/* Body Content */}
      <div className="space-y-4 text-justify text-xs leading-relaxed text-black">
        <p>জনাব,</p>
        <p>
          আপনার অবগতির জন্য জানাচ্ছি যে, সোনালী ব্যাংক পিএলসি-এর অনলাইন পেমেন্ট গেটওয়ে সেবার মাধ্যমে{' '}
          <span className="font-bold px-1 text-black">{instituteName}</span> এর শিক্ষার্থীদের নিকট হতে যাবতীয় বেতন/ফি/চার্জ আদায় করার সিদ্ধান্ত গ্রহণ করা হয়েছে। উক্ত বেতন/ফি/চার্জ আদায়ের চুক্তিতে আমি নিম্নস্বাক্ষরকারী সম্মতি জ্ঞাপন করছি।
        </p>

        <p>
          এতদ্বিষয়ে অত্র প্রতিষ্ঠানের সকল কার্যক্রম সোনালী ব্যাংক পিএলসি-এর ভেন্ডর প্রতিষ্ঠান অটোমেট আইটি লিমিটেড-এর মাধ্যমে সম্পাদন করার জন্য প্রয়োজনীয় ব্যবস্থা গ্রহণের অনুরোধ জানাচ্ছি।
        </p>
      </div>

      {/* Signature & Details */}
      <div className="pt-10 mt-8 max-w-xs text-black">
        <p className="font-bold text-sm text-black">{headName}</p>
        <p className="text-black font-medium">{designation}</p>
        <p className="text-black font-semibold">{instituteName}</p>
        <p className="text-black font-mono mt-0.5">মোবাইল: {headMobile}</p>
      </div>
    </div>
  );
};
