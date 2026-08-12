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
    <div className="bg-white text-gray-900 font-sans text-sm leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-8 flex items-center justify-center text-gray-400 text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient Header */}
      <div className="space-y-1 mb-8 text-sm font-medium">
        <p>বরাবর,</p>
        <p>ডেপুটি জেনারেল ম্যানেজার,</p>
        <p>ডোমেইন, বি.টি.সি.এল</p>
        <p>মগবাজার টেলিফোন ভবন, ঢাকা-১২০৭।</p>
      </div>

      {/* Subject */}
      <div className="mb-8 font-bold text-base border-b border-gray-300 pb-2">
        বিষয়: নতুন Web Address প্রদান প্রসঙ্গে।
      </div>

      {/* Body Content */}
      <div className="space-y-6 text-justify text-sm leading-loose">
        <p>জনাব,</p>
        <p>
          আমি <span className="font-bold underline px-1">{headName}</span>, <span className="font-bold underline px-1">{designation}</span>, <span className="font-bold underline px-1">{instituteName}</span>। সরকারি নির্দেশনা মোতাবেক প্রতিষ্ঠানকে ডিজিটাল করার লক্ষ্যে আপনার প্রতিষ্ঠান থেকে (<span className="font-bold underline font-mono px-1">{websiteAddress}</span>) একটি Web Address ব্যবহার করতে চাই।
        </p>

        <p>
          অতএব উক্ত Web Address টি আমার প্রতিষ্ঠান এর নামে প্রদান করার জন্য আপনার সু-মর্জি কামনা করছি।
        </p>

        <p className="font-semibold pt-2">
          বিষয়টি অতীব জরুরী।
        </p>
      </div>

      {/* Signature & Head Details */}
      <div className="pt-20 mt-12 border-t-2 border-gray-800 max-w-sm">
        <p className="font-bold text-base text-gray-900">{headName}</p>
        <p className="text-gray-700 font-medium">{designation}</p>
        <p className="text-gray-900 font-semibold">{instituteName}</p>
        <p className="text-gray-700 font-mono mt-1">মোবাইল: {headMobile}</p>
        <p className="text-xs text-gray-400 mt-4">[ স্বাক্ষর ও প্রাতিষ্ঠানিক সিল ]</p>
      </div>
    </div>
  );
};
