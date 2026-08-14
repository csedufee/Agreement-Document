import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const WebsiteWorkOrderDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const designation = data.designation || 'প্রধান শিক্ষক / অধ্যক্ষ';
  const instituteName = data.instituteName || '—';
  const instituteAddress = data.instituteAddress || '—';
  const upazilaThana = data.upazilaThana || '—';
  const district = data.district || '—';
  
  const headName = data.headName || '—';
  const headMobile = data.headMobile || '—';
  const ictInchargeName = data.ictInchargeName || '—';
  const ictInchargeMobile = data.ictInchargeMobile || '—';
  const websiteAddress = data.websiteAddress || 'pay.academyims.com';
  const dateStr = data.date || new Date().toLocaleDateString('bn-BD');

  const firstYearFee = data.websiteFirstYearFee ? `৳ ${data.websiteFirstYearFee}` : '—';
  const renewalFee = data.websiteRenewalFee ? `৳ ${data.websiteRenewalFee}` : '—';

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Date */}
      <div className="flex justify-end items-center mb-3 text-xs">
        <div>
          <p className="font-semibold text-black">তারিখ: <span className="font-mono font-normal">{dateStr}</span></p>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-3 space-y-0.5 text-xs">
        <p className="font-bold text-black text-[11px] uppercase tracking-wider mb-0.5">প্রাপকঃ</p>
        <p className="font-bold text-black">ম্যানেজার, বিজনেস অপারেশন্স</p>
        <p className="font-semibold text-black">অটোমেট আইটি লিমিটেড</p>
        <p className="text-black">হাউজ- ৩৪/এ, রোড- ১৩/২, ব্লক- কে, দক্ষিণ বনশ্রী, ঢাকা-১২১৯।</p>
      </div>

      {/* Subject */}
      <div className="mb-3 font-bold text-sm text-black">
        বিষয়ঃ ডায়নামিক ওয়েবসাইট ডেভেলপমেন্ট কার্যাদেশ (Work Order)।
      </div>

      {/* Body Content */}
      <div className="space-y-2.5 text-justify text-xs leading-normal text-black">
        <p>জনাব,</p>
        <p>
          উপযুক্ত বিষয়ের আলোকে জানানো যাচ্ছে যে, <span className="font-bold px-1">{instituteName}</span> এর শিক্ষা কার্যক্রম আধুনিকীকরণ, ডিজিটালাইজেশন এবং প্রাতিষ্ঠানিক তথ্যাদি প্রচার ও প্রসারের লক্ষ্যে একটি পেশাদার, রেসপন্সিভ ও কাস্টমাইজড ডায়নামিক ওয়েবসাইট ডেভেলপমেন্ট করা প্রয়োজন।
        </p>

        <p>
          উক্ত কাজ সফলভাবে বাস্তবায়ন ও নিয়মিত কারিগরি সহায়তার জন্য আপনার স্বনামধন্য প্রতিষ্ঠান <span className="font-bold">"অটোমেট আইটি লিমিটেড"</span>-কে নিম্নলিখিত মূল বৈশিষ্ট্যসমূহ ও শর্তাধীনে ডায়নামিক ওয়েবসাইট ডেভেলপমেন্ট কার্যাদেশ (Work Order) প্রদান করা হলো:
        </p>

        <div className="bg-white border border-black rounded-md p-2.5 my-2 space-y-1 text-xs text-black">
          <p className="font-bold text-xs text-black mb-1.5">১. ডায়নামিক ওয়েবসাইটের মূল বৈশিষ্ট্যসমূহ (Features & Scope of Work):</p>
          <ul className="list-disc list-inside space-y-1 text-black">
            <li><span className="font-semibold text-black">সম্পূর্ণ ডায়নামিক CMS সিস্টেম:</span> সহজেই নিজে নিজে কন্টেন্ট, তথ্য ও সংবাদ আপডেট করার সুবিধা।</li>
            <li><span className="font-semibold text-black">ইন্টারেক্টিভ নোটিশ ও মিডিয়া:</span> ডায়নামিক নোটিশ বোর্ড, ফটো গ্যালারি ও ইভেন্ট ক্যালেন্ডার।</li>
            <li><span className="font-semibold text-black">সিকিউরিটি ও হোস্টিং:</span> SSL সিকিউরিটি সার্টিফিকেট এবং ডোমেইন-হোস্টিং সার্ভিস সহ (<span className="font-mono text-black">{websiteAddress}</span>)।</li>
            <li><span className="font-semibold text-black">সরকারি নির্দেশনা অনুসরণ:</span> মাধ্যমিক ও উচ্চ শিক্ষা অধিদপ্তর (DSHE) নির্দেশিত সকল স্ট্যান্ডার্ড ফিচার।</li>
          </ul>
        </div>

        <div className="bg-white border border-black rounded-md p-2.5 my-2 space-y-1 text-xs text-black">
          <p className="font-bold text-xs text-black mb-1.5">২. প্রাতিষ্ঠানিক তথ্যাবলী ও যোগাযোগ কর্মকর্তা:</p>
          <div className="grid grid-cols-2 gap-1.5 text-black">
            <p><span className="font-semibold">প্রতিষ্ঠানের নাম:</span> {instituteName}</p>
            <p><span className="font-semibold">ঠিকানা:</span> {instituteAddress}, {upazilaThana}, {district}</p>
            <p><span className="font-semibold">আইসিটি ইনচার্জ:</span> {ictInchargeName}</p>
            <p><span className="font-semibold">ইনচার্জ মোবাইল:</span> {ictInchargeMobile}</p>
          </div>
        </div>

        <div className="bg-white border border-black rounded-md p-2.5 my-2 space-y-1 text-xs text-black">
          <p className="font-bold text-xs text-black mb-1.5">৩. সার্ভিস চার্জ ও আর্থিক শর্তাবলী (Financial Details & Charges):</p>
          <div className="space-y-1 text-black">
            <p className="flex justify-between items-center pb-2">
              <span className="font-semibold text-black">প্রথম বছরের ডোমেইন, হোস্টিং, ডিজাইন ও ডেভেলপমেন্ট ফি:</span>
              <span className="inline-flex items-center justify-center px-3 py-1.5 min-w-[90px] border border-black rounded-md font-bold font-mono text-xs text-black bg-white">{firstYearFee}</span>
            </p>
            <p className="flex justify-between items-center pt-0.5">
              <span className="font-semibold text-black">পরবর্তী বছরগুলোর বার্ষিক রিনিউয়াল ফি (ডোমেইন ও হোস্টিং):</span>
              <span className="inline-flex items-center justify-center px-3 py-1.5 min-w-[90px] border border-black rounded-md font-bold font-mono text-xs text-black bg-white">{renewalFee}</span>
            </p>
          </div>
        </div>

        <p>
          অতএব, উক্ত কার্যাদেশ অনুযায়ী দ্রুততম সময়ের মধ্যে ডায়নামিক ওয়েবসাইট ডেভেলপমেন্ট কাজ সম্পন্ন করে প্রস্তুত করার জন্য বিশেষভাবে অনুরোধ করা হলো।
        </p>
      </div>

      {/* Signature & Details */}
      <div className="pt-6 mt-4 max-w-xs text-black">
        <p className="font-bold text-sm text-black">{headName}</p>
        <p className="text-black font-medium">{designation}</p>
        <p className="text-black font-semibold">{instituteName}</p>
        <p className="text-black font-mono mt-0.5">মোবাইল: {headMobile}</p>
      </div>
    </div>
  );
};
