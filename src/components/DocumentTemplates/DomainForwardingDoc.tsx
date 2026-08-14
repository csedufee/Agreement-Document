import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const DomainForwardingDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const headName = data.headName || '—';
  const designation = data.designation || '—';
  const instituteName = data.instituteName || '—';
  const websiteAddress = data.websiteAddress || 'pay.academyims.com';
  const headMobile = data.headMobile || '—';

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient Header */}
      <div className="space-y-0.5 mb-4 text-xs font-medium text-black">
        <p>বরাবর,</p>
        <p>ডেপুটি জেনারেল ম্যানেজার,</p>
        <p>ডোমেইন, বি.টি.সি.এল</p>
        <p>মগবাজার টেলিফোন ভবন, ঢাকা-১২০৭।</p>
      </div>

      {/* Subject */}
      <div className="mb-4 font-bold text-sm text-black">
        বিষয়: নতুন Web Address প্রদান প্রসঙ্গে।
      </div>

      {/* Body Content */}
      <div className="space-y-4 text-justify text-xs leading-relaxed text-black">
        <p>জনাব,</p>
        <p>
          আমি <span className="font-bold px-1 text-black">{headName}</span>, <span className="font-bold px-1 text-black">{designation}</span>, <span className="font-bold px-1 text-black">{instituteName}</span>। সরকারি নির্দেশনা মোতাবেক প্রতিষ্ঠানকে ডিজিটাল করার লক্ষ্যে আপনার প্রতিষ্ঠান থেকে (<span className="font-bold font-mono px-1 text-black">{websiteAddress}</span>) একটি Web Address ব্যবহার করতে চাই।
        </p>

        <p>
          অতএব উক্ত Web Address টি আমার প্রতিষ্ঠান এর নামে প্রদান করার জন্য আপনার সু-মর্জি কামনা করছি।
        </p>

        <p className="font-semibold pt-1 text-black">
          বিষয়টি অতীব জরুরী।
        </p>
      </div>

      {/* Signature & Head Details */}
      <div className="pt-10 mt-8 max-w-xs text-black">
        <p className="font-bold text-sm text-black">{headName}</p>
        <p className="text-black font-medium">{designation}</p>
        <p className="text-black font-semibold">{instituteName}</p>
        <p className="text-black font-mono mt-0.5">মোবাইল: {headMobile}</p>
      </div>
    </div>
  );
};
