import React from 'react';
import { InstituteAgreementData } from '../../types';
import { calculateExpiryDate } from '../../data/modules';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const AgreementDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const expiryDate = data.expiryDate || calculateExpiryDate(data.date || '08/08/2026');
  const allModules = [...(data.baseModules || []), ...(data.selectedOptionalModules || [])];

  const studentNum = Math.max(300, Number(data.studentCount) || 300);
  const totalCharge = (Number(data.calculatedServiceCharge) || 0) * studentNum;

  return (
    <div className="bg-white text-gray-900 font-serif text-sm leading-relaxed p-8 max-w-[850px] mx-auto printable-document legal-page-document">
      {/* Government Stamp Paper Space (Sufficient clearance reserved at the top of page for legal stamp) */}
      {showPadHeaderSpace && (
        <div className="h-[3.25in] border-2 border-dashed border-gray-300 rounded-md mb-6 flex flex-col items-center justify-center text-gray-400 text-xs bg-slate-50/50 pad-space-box">
          <span className="font-sans font-bold text-gray-500 mb-1 pad-space-label no-print">সরকারি স্ট্যাম্প / প্যাডের জন্য নির্ধারিত স্থান</span>
          <span className="text-[11px] text-gray-400 pad-space-label no-print">(প্রিন্ট করার সময় এই ৩.২৫ ইঞ্চি ফাঁকা জায়গায় সরকারি স্ট্যাম্প বসবে)</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1 font-sans">একাডেমির সেবা চুক্তি</h1>
        <p className="text-base font-semibold text-gray-700 font-sans">[শিক্ষা প্রতিষ্ঠান ব্যবস্থাপনা সফটওয়্যার]</p>
      </div>

      {/* Contract Dates */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-300 mb-6 font-sans text-xs">
        <div>
          <span className="font-semibold text-gray-800">চুক্তির তারিখঃ </span>
          <span className="font-bold text-blue-900">{data.date || '০৮/০৮/২০২৬'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-800">চুক্তির মেয়াদঃ </span>
          <span className="font-bold text-blue-900">{expiryDate}</span>
        </div>
      </div>

      {/* Parties Info Table */}
      <div className="space-y-6 mb-6">
        {/* First Party */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="bg-gray-800 text-white font-bold px-4 py-2 font-sans text-xs">
            ১ম পক্ষ ( অটোমেট আইটি লিমিটেড)
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans">
            <div><span className="font-semibold text-gray-700">নামঃ</span> আতিকুর রহমান</div>
            <div><span className="font-semibold text-gray-700">পদবীঃ</span> ম্যানেজার, বিজনেস অপারেশন্স</div>
            <div><span className="font-semibold text-gray-700">মোবাইল নম্বরঃ</span> ০১৬২৯১৮০৩৪৯</div>
            <div><span className="font-semibold text-gray-700">ইমেলঃ</span> automateitbd@gmail.com</div>
            <div className="col-span-2"><span className="font-semibold text-gray-700">অফিস ঠিকানাঃ</span> হাউজ- ৩৪/এ, রোড- ১৩/২, বল্ক- কে, সাউথ বনশ্রী, ঢাকা-১২১৯</div>
          </div>
        </div>

        {/* Second Party */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="bg-gray-800 text-white font-bold px-4 py-2 font-sans text-xs">
            ২য় পক্ষ ({data.instituteName || 'শিক্ষা প্রতিষ্ঠান'})
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-sans">
            <div className="col-span-2"><span className="font-semibold text-gray-700">প্রতিষ্ঠানের নামঃ</span> <span className="font-bold text-gray-900">{data.instituteName || '—'}</span></div>
            <div><span className="font-semibold text-gray-700">কর্তৃপক্ষের নামঃ</span> {data.headName || '—'}</div>
            <div><span className="font-semibold text-gray-700">পদবীঃ</span> {data.designation || '—'}</div>
            <div><span className="font-semibold text-gray-700">মোবাইল নম্বরঃ</span> {data.headMobile || '—'}</div>
            <div><span className="font-semibold text-gray-700">Telephone:</span> —</div>
            <div className="col-span-2"><span className="font-semibold text-gray-700">ইমেলঃ</span> {data.instituteEmail || '—'}</div>
            <div><span className="font-semibold text-gray-700">পরিচালনা কমিটির সভাপতিঃ</span> {data.chairmanName || '—'}</div>
            <div><span className="font-semibold text-gray-700">মোবাইল নম্বরঃ</span> {data.chairmanMobile || '—'}</div>
            <div><span className="font-semibold text-gray-700">ICT ইন-চার্জঃ</span> {data.ictInchargeName || '—'}</div>
            <div><span className="font-semibold text-gray-700">মোবাইল নম্বরঃ</span> {data.ictInchargeMobile || '—'}</div>
            <div className="col-span-2"><span className="font-semibold text-gray-700">ঠিকানাঃ</span> {data.instituteAddress || '—'}</div>
            <div><span className="font-semibold text-gray-700">উপজেলা/থানাঃ</span> {data.upazilaThana || '—'}</div>
            <div><span className="font-semibold text-gray-700">জেলাঃ</span> {data.district || '—'}</div>
            <div><span className="font-semibold text-gray-700">বিভাগঃ</span> {data.division || '—'}</div>
            <div><span className="font-semibold text-gray-700">প্রতিষ্ঠানের ধরণঃ</span> {data.instituteType || '—'}</div>
            <div><span className="font-semibold text-gray-700">শিক্ষা বোর্ডঃ</span> {data.educationBoard || '—'}</div>
          </div>
        </div>
      </div>

      {/* Price Plan */}
      <div className="border border-gray-300 rounded overflow-hidden mb-6">
        <div className="bg-gray-800 text-white font-bold px-4 py-2 font-sans text-xs">
          প্রাইস প্ল্যান ( প্যাকেজ ওয়াইজ)
        </div>
        <div className="p-4 space-y-3 text-xs font-sans">
          <div>
            <span className="font-semibold text-gray-900 block mb-1">মডিউল লিস্টঃ</span>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs flex flex-wrap gap-1.5">
              {allModules.map((m, idx) => (
                <span key={idx} className="bg-white px-2 py-1 rounded border border-gray-300 font-medium text-gray-800">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><span className="font-semibold text-gray-700">শিক্ষার্থীর সংখ্যাঃ</span> {data.studentCount || '৩০০'}</div>
            <div><span className="font-semibold text-gray-700">শিক্ষক ও কর্মচারীদের সংখ্যাঃ</span> {data.teacherCount || '—'}</div>
          </div>

          <div className="text-gray-700 italic text-[11px] bg-amber-50 p-2.5 rounded border border-amber-200">
            নোটঃ নূন্যতম শিক্ষার্থী সংখ্যা ৩০০জন হতে হবে, এর কম শিক্ষার্থী হলেও ৩০০জন শিক্ষার্থী অনুপাতে সার্ভিস চার্জ প্রযোজ্য হবে।
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 font-medium border-t border-gray-200">
            <div><span className="font-semibold text-gray-700">পেমেন্ট টাইপঃ</span> বাৎসরিক</div>
            <div><span className="font-semibold text-gray-700">সার্ভিস চার্জঃ</span> {data.calculatedServiceCharge || 0}/-</div>
            <div className="col-span-2"><span className="font-semibold text-gray-700">টোটাল সার্ভিস চার্জঃ</span> {totalCharge.toLocaleString()} BDT</div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 text-xs">
            <div><span className="font-semibold text-gray-700">ওয়েবসাইট সার্ভিস চার্জ, হোস্টিং এবং বাৎসরিক রিনিউ চার্জ:</span> ৫০০০/-</div>
            <div><span className="font-semibold text-gray-700">রেজিস্ট্রেশন চার্জঃ</span> ১০০০/-</div>
          </div>
        </div>
      </div>

      {/* Recital */}
      <p className="text-xs text-justify leading-relaxed mb-4 font-sans text-gray-800">
        ১ম পক্ষের প্রস্তাবনায় সম্মত হয়ে ২য় পক্ষ ১ম পক্ষের অনলাইন ভিত্তিক শিক্ষা প্রতিষ্ঠান ব্যবস্থাপনা সফটওয়্যার এর পরিপুর্ণভাবে প্রেজেন্টেশন দেখে, একে অন্যের সকল বিষয়াবলীর মর্ম উপলব্ধি করে ১ম ও ২য় পক্ষ একে অপরের সাথে নিম্নলিখিত চুক্তির ভিত্তিতে অনলাইন ভিত্তিক শিক্ষা প্রতিষ্ঠান ব্যবস্থাপনা সফটওয়্যার ব্যবহারের চুক্তিনামা সম্পাদন করছি।
      </p>

      {/* Page Signature Bar 1 */}
      <div className="my-4 pt-2 pb-2 border-t border-b border-gray-400 bg-gray-50/80 px-4 rounded font-sans text-xs flex justify-between items-center text-gray-800">
        <div>
          <span className="font-bold">১ম পক্ষ (অটোমেট আইটি) স্বাক্ষর:</span> ______________________
        </div>
        <div>
          <span className="font-bold">২য় পক্ষ ({data.instituteName || 'শিক্ষা প্রতিষ্ঠান'}) স্বাক্ষর ও সীল:</span> ______________________
        </div>
        <span className="text-[10px] text-gray-500 italic">[ পেজ স্বাক্ষর ]</span>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h3 className="font-bold text-sm border-b-2 border-gray-800 pb-1 mb-3 font-sans">শর্তাবলী</h3>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-justify leading-relaxed font-sans text-gray-800">
          <li>১ম পক্ষ বলতে “অটোমেট আইটি লিমিটেড” কে বুঝাবে এবং ২য় পক্ষ বলতে “{data.instituteName || 'শিক্ষা প্রতিষ্ঠান'}” বুঝাবে।</li>
          <li>২য় পক্ষ যে কোন সময় বর্তমান প্যাকেজ পরিবর্তন করে পরবর্তী উর্ধ্বতন কোন প্যাকেজে পরিবর্তিত(মাইগ্রেট) হওয়ার সুবিধা গ্রহণ করতে পারবে। সেক্ষেত্রে অত্র চুক্তিতে সংযুক্তি যুক্ত হবে।</li>
          <li>২য় পক্ষ নির্ধারিত তারিখের মধ্যে ১ম পক্ষের নির্ধারিত ফরমেট অনুযায়ী যাবতীয় তথ্য সমূহ ১ম পক্ষকে বুঝিয়ে দিবে এবং প্রিন্টেড কপি সমূহে ২য় পক্ষের সংশ্লিষ্ট কর্তৃপক্ষ স্বাক্ষর প্রদান করবেন।  উল্লেখ্য,  ২য় পক্ষ নির্ধারিত তারিখের পর তথ্য প্রদান করলেও তা সফটওয়ার হ্যান্ডওভারের তারিখের সাথে সম্পর্কযুক্ত হবে না।</li>
          <li>১ম পক্ষের দেওয়া নির্ধারিত ফরম্যাট এ ২য় পক্ষ  - ক্লাস, শিফট, সেকশন অনুসারে ছাত্র-ছাত্রীদের নাম, রোল, জেন্ডার, ধর্ম, বাবার নাম, মায়ের নাম, অভিভাবকের মোবাইল নম্বর সহ প্রয়োজনীয় তথ্য প্রদান করবেন। ১ম পক্ষ উল্লেখিত ডাটা সমূহ সফট্ওয়ারে এন্ট্রি করে দিবে এবং ছাত্র-ছাত্রীদের বিস্তারিত তথ্য সংরক্ষণের অপশন সহ ২য় পক্ষকে বুঝিয়ে দিবে যেন ২য় পক্ষ প্রয়োজন অনুযায়ী তথ্য সন্নিবেশন করতে পারে। একই সাথে শিক্ষকগণের নাম, জেন্ডার, ধর্ম, পদবী, মোবাইল নম্বর সমূহ সফটওয়্যার এন্ট্রি করে দিবে এবং বিস্তারিত তথ্য সংরক্ষণের অপশন সহ ২য় পক্ষ কে বুঝিয়ে দিবে।</li>
          <li>সকল ডেটা ইনপুট হওয়ার পরে, প্রথম পক্ষ দ্বিতীয় পক্ষের সকল ব্যবহারকারীদের সফটওয়্যার ব্যবহারের জন্য একটি শারীরিক প্রশিক্ষণ সেশন প্রদান করবে। যেকোনো সার্ভিস চার্জ ব্যাতিত প্রথম পক্ষ পাঁচটি ভার্চুয়াল প্রশিক্ষণ সেশন প্রদান করবে। অতিরিক্ত প্রশিক্ষণ সেশনের জন্য অতিরিক্ত সেবা চার্জ প্রযোজ্য হবে।</li>
          <li>২য় পক্ষ টাইম অ্যাটেনডেন্স মেশিন ব্যবহার করতে চাইলে,  ১ম পক্ষ তা সফটওয়ারের সাথে ইন্টিগ্রেশন এর ব্যবস্থা করবে।  যদি ১ম পক্ষ কর্তৃক উক্ত মেশিন সরবরাহ করা হয়েও থাকে তথাপি মেশিনের কোন প্রকার ত্রুটি বিচ্যুতি জনিত কারণে ২য় পক্ষ সফটওয়্যার বা অন্য কোন সার্ভিসের কোন প্রকার বিল আটকে রাখতে পারবে না। সফটওয়্যার এর সাথে মেশিন ইন্টিগ্রেশনের ক্ষেত্রে মেশিন প্রতি ইন্টিগ্রেশন চার্জ প্রযোজ্য।</li>
          <li>১ম পক্ষ ২য় পক্ষের কাজের নিরাপত্তা ও সুবিধার জন্য অ্যাডমিনিস্ট্রেটিভ রোল অনুযায়ী অপারেটর, ক্লাস টিচার, সাবজেক্ট টিচার, একাউন্টেন্ট (প্রযোজ্য ক্ষেত্রে) ও অ্যাডমিন হিসেবে ভিন্ন ভিন্ন ইউজার আইডি ও পাসওয়ার্ড প্রটেক্টেড প্যানেলের ব্যবস্থা করবে।</li>
          <li>১ম পক্ষ ২য় পক্ষ কে সফটওয়্যার এর পূর্ণাঙ্গ দখল বুঝিয়ে দেয়ার সময় নিরাপত্তা ও গোপনীয়তার স্বার্থে ২য় পক্ষ তার এডমিন প্যানেলের পাসওয়ার্ড পরিবর্তন করে নিবে। কাস্টমার সার্ভিস গ্রহণের প্রয়োজনে ১ম পক্ষকে পাসওয়ার্ড প্রদান করলেও সার্ভিস গ্রহণের পরপরই ২য় পক্ষ পাসওয়ার্ড নিজ দায়িত্বে পুনরায় পরিবর্তন করে নিবে।</li>
          <li>যেহেতু ২য় পক্ষের গুরুত্বপূর্ণ ডাটা সমূহ ১ম পক্ষের নিয়ন্ত্রণাধীন অনলাইন সার্ভারে সংরক্ষিত থাকবে।  সেহেতু ২য় পক্ষের গুরুত্বপূর্ণ সকল ডাটার নিরাপত্তা ও ব্যাকআপ ১ম পক্ষের নিজ দায়িত্বে সংরক্ষণ করবে এবং চাওয়া মাত্র ডাটাসমূহ ২য় পক্ষকে সরবরাহ করতে বাধ্য থাকবে।  ২য় পক্ষ তার সকল ডাটা সমূহ যেকোনো মুহূর্তে ডাউনলোড, প্রিন্ট, কপি করা ইত্যাদি স্বাচ্ছন্দে উপভোগ করবে এবং ২য় পক্ষের প্রয়োজন মাফিক সংরক্ষণ করতে পারবে। উল্লেখ্য,  কোন রকম আবেদন ছাড়া ৩ মাসের বেশি সময় বিল বকেয়া অবস্থায় আইডি বন্ধ থাকলে ১ম পক্ষের সার্ভার হতে সমস্ত ডাটা মুছে ফেলা হবে।  সে ক্ষেত্রে ২য় পক্ষের কোনো প্রকার দাবি অভিযোগ ও আপত্তি গ্রহণযোগ্য হবে না।</li>
          <li>১ম পক্ষ ২য় পক্ষের প্রদত্ত তথ্যের ভিত্তিতে পরিপূর্ণ সফটওয়্যার তৈরির কাজ সম্পাদন পূর্বক নির্ধারিত তারিখের মধ্যে বুঝিয়ে দিবে এবং ধাপে ধাপে ২য় পক্ষের নিযুক্ত ব্যক্তিবর্গকে প্রয়োজনীয় প্রশিক্ষণ প্রদান করবে।</li>
          <li>ইনস্টিটিউট ম্যানেজমেন্ট সিস্টেম ব্যবহার,  উচ্চমান সম্পন্ন অনলাইন ভিত্তিক ডেডিকেটেড সার্ভার এর রেন্টাল চার্জ,  মেনটেনেন্স চার্জ, সিকিউরিটি (হ্যাকিং, ম্যালওয়্যার, স্পাইওয়্যার, ভাইরাস ইত্যাদির প্রটেকশন) ব্যাক-আপ  সার্ভারের রেন্টাল চার্জ, সাপোর্ট-সার্ভিস, প্রতিনিয়ত সফটওয়্যারে নতুন নতুন মডিউল ডেভেলপমেন্ট ও আপডেট ইত্যাদির জন্য ২য় পক্ষ ১ম পক্ষকে প্রত্যেক ছাত্র-ছাত্রীর জন্য নির্ধারিত হারে সার্ভিস চার্জ প্রদান করবে। ছাত্র-ছাত্রী কম-বেশি হলে সার্ভিস চার্জ কম-বেশি হবে। বর্তমান ছাত্র-ছাত্রীর সংখ্যা ২য় পক্ষ তার ড্যাশবোর্ডে দেখতে পাবেন।</li>
          <li>নির্ধারিত সার্ভিস চার্জ সমূহ এগ্রিমেন্ট এর তারিখ হতে ১৫ কর্ম দিবস এর মধ্যে অগ্রীম হিসেবে পরিশোধ করতে হবে, অন্যথায় ১ম পক্ষ কর্তৃক ২য় পক্ষকে সার্ভিস প্রদান বন্ধ হয়ে গেলে ১ম পক্ষ দায়ী থাকবে না। সেক্ষেত্রে সমুদয় পাওনা পরিশোধ পূর্বক সার্ভিস গ্রহণ নিয়মিত করতে হবে।</li>
          <li>এসএমএস ব্যবহারের ক্ষেত্রে ২য় পক্ষ সফটওয়্যার এর ড্যাশবোর্ড হতে প্রি-পেইড আকারে বর্তমান নির্ধারিত মূল্য তথা এসএমএস প্রতি নন-মাস্কিং ০.৪০ (চশল্লি পয়সা) এবং মাস্কিং ০.৬০ (ষাট পয়সা) হারে ক্রয় করবে। উল্লেখ্য, সরকার ও মোবাইল কোম্পানী কর্তৃক পলিসি/মূল্য পরিবর্তন-পরিবর্ধন হলে এসএমএস এর মূল্য বৃদ্ধি হতে পারে।</li>

          {/* Page Signature Bar 2 */}
          <div className="my-4 pt-2 pb-2 border-t border-b border-gray-400 bg-gray-50/80 px-4 rounded font-sans text-xs flex justify-between items-center text-gray-800">
            <div>
              <span className="font-bold">১ম পক্ষ (অটোমেট আইটি) স্বাক্ষর:</span> ______________________
            </div>
            <div>
              <span className="font-bold">২য় পক্ষ ({data.instituteName || 'শিক্ষা প্রতিষ্ঠান'}) স্বাক্ষর ও সীল:</span> ______________________
            </div>
            <span className="text-[10px] text-gray-500 italic">[ পেজ স্বাক্ষর ]</span>
          </div>
          <li>এসএমএস এর যে কোনো অপব্যবহার / রাষ্ট্র বিরোধী প্রচার / রাজনৈতিক উদ্দেশ্যে ব্যবহার ইত্যাদির ক্ষেত্রে এসএমএস ব্যবহারকারী ২য় পক্ষই দায়ী থাকবেন।</li>
          <li>সফটওয়্যার ব্যতীত অন্যান্য হার্ডওয়্যার তথা- প্রিন্টার, স্ক্যানার, ল্যাপটপ, কম্পিউটার, রাউটার, মডেম সহ যাবতীয় হার্ডওয়ার ১ম পক্ষ কর্তৃক প্রদত্ত / সরবরাহকৃত নয়, সেহেতু ১ম পক্ষ এগুলোর সমস্যা হলে কোন প্রকার সমাধান দিতে বাধ্য থাকবে না।</li>
          <li>২য় পক্ষ কম্পিউটার, ল্যাপটপ, প্রিন্টার, মডেম ইত্যাদির কারণে কিংবা ফোকাল পয়েন্ট (জনবল) এর অভাব ইত্যাদি কারণে সফটওয়্যার এর যথাযথ আউটপুট নিতে ব্যর্থ হলে কোন প্রকার কারণ দর্শিয়ে ১ম পক্ষের প্রাপ্ত বিল বা সার্ভিস চার্জ সমূহ কোনোভাবেই বিলম্ব করতে বা আটকে দিতে পারবে না।</li>
          <li>পরীক্ষার সকল সেটিং ও কনফিগার ২য় পক্ষের দ্বায়িত্বপ্রাপ্ত ব্যাক্তি সেট করবেন ও পরীক্ষার মার্ক সমূহ ২য় পক্ষ নিজ দায়িত্বে ইনপুট করবেন। মার্ক ইনপুটের পূর্বে সকল প্রকার কনফিগারেশন ঠিক আছে কিনা তা প্রয়োজনীয় ক্ষেত্রে  ২য় পক্ষ ১ম পক্ষের সাপোর্ট সেন্টার থেকে অফিস চলাকালীন সময়ে(সকাল ১০টা থেকে বিকাল ৩টা পর্যন্ত) বুঝে রাখবেন। রেজাল্ট চূড়ান্তকরণের পূর্বে সকল ধরনের কারেকশন ২য় পক্ষ নিজ দায়িত্বে করবেন।</li>
          <li>একাউন্টস মডিউল এর ক্ষেত্রে ২য় পক্ষের সকল হিসাবের খাতা অনুযায়ী, সফটওয়্যার হ্যান্ডওভার এর ডেট পর্যন্ত সর্বশেষ ক্লোজিং ব্যালেন্স / জের থেকে একাউন্টিং শুরু হবে। কোনভাবেই পূর্বের ভাউচার এন্ট্রি করে দেয়া  ও পূর্বের হিসাব মেলানোর দায়িত্ব ১ম পক্ষ গ্রহণ করবেনা। সেক্ষেত্রে ১ম পক্ষ ২য় পক্ষের মনোনীত ব্যক্তি / ব্যক্তিবর্গকে প্রয়োজনীয় প্রশিক্ষণ প্রদান করবে। ভাউচার এন্ট্রি ও একাউন্টস এর গোপনীয় ডাটার সুরক্ষা ও সংরক্ষণের নিমিত্তে অবশ্যই ২য় পক্ষ নিজ দায়িত্বে পাসওয়ার্ড পরিবর্তন করে নিবেন।</li>
          <li>২য় পক্ষের সফটওয়্যার সংক্রান্ত যাবতীয় সমস্যা ১ম পক্ষ অনলাইনে ও টেলি-যোগাযোগের মাধ্যমে যত দ্রুত সম্ভব সমাধান করবে, সেক্ষেত্রে সমস্যার ধরণ অনুযায়ী ২য় পক্ষের ৩ কার্যদিবস পর্যন্ত অপেক্ষা করতে হতে পারে। যদি সমস্যা সমাধানে ২য় পক্ষ ১ম পক্ষের প্রতিনিধির স্ব-শরীরে উপস্থিতি চায় তাহলে আলোচনা সাপেক্ষে নির্ধারিত খরচ ২য় পক্ষ বহন করবেন।</li>
          <li>২য় পক্ষ কর্তৃক ১ম পক্ষের কোন কর্মকর্তা/কর্মচারীকে কোন ধরণের চাকুরী বা ব্যবসায়িক প্রস্তাবনা প্রদান করিতে পারিবে না।</li>
          <li>চুক্তি অনুযায়ী ১ম পক্ষের প্রতিষ্ঠানে সফটওয়্যার এর সফল ইমপ্লিমেন্টেশনের পর ১ম পক্ষ ২য় পক্ষকে প্রত্যয়ণ পত্র প্রদান করবেন।</li>
          <li>২য় পক্ষ সফটওয়্যার ব্যবহারকালীন সময়ে যেকোন ধরণের এরর বা আপডেট  পাবেন অতিরিক্ত কোন খরচ  বা চার্জ ছাড়া। ২য় পক্ষ হতে চুক্তিতে উল্লেখিত মডিউল বা ফিচার ব্যাতিত কোন নতুন রিকুয়্যারমেন্ট প্রদান করা হলে তা সফটওয়্যার এ অন্তর্ভুক্ত করতে বাড়তি চার্জ প্রযোজ্য হবে।</li>
          <li>চুক্তিতে উল্লেখিত সফটওয়্যার এর সোর্সকোড, প্যাটেন্ট, কপিরাইট, ট্রেড সিক্রেট সহ বাগ ফিক্সিং, মডিফিকেশন এবং সকল আপডেট এর স্বত্বাধিকারি ১ম পক্ষ।</li>
          <li>২য় পক্ষ যদি চুক্তির মেয়াদ থাকা অবস্থায় সফটওয়্যার ব্যবহার করতে না চান, তাহলে অন্তত দুই মাস পূর্বে সকল বকেয়া পরিশোধ পূর্বক লিখিত আবেদন করতে হবে। কোন পক্ষ কর্তৃক দুই মাস এর পূর্বে চুক্তি বাতিল এর কোন বিজ্ঞপ্তি প্রদান না করা হলে চুক্তির মেয়াদ শেষে চুক্তিটি বছর ভিত্তিতে নবায়িত হতে থাকবে।</li>
          <li>এই চুক্তি গণপ্রজাতন্ত্রী বাংলাদেশ সরকার এর চুক্তি আইন এর অধীনে পরিচালিত হবে।</li>
        </ol>
      </div>

      <p className="text-xs text-justify leading-relaxed mb-8 font-sans text-gray-800">
        এমতাবস্থায়, আমরা উভয় পক্ষ চুক্তিপত্রের উভয় পৃষ্ঠার সকল তথ্য ও শর্ত সমূহের মর্ম উপলব্ধি করে সুস্থ্য মস্তিস্কে, স্ব-জ্ঞানে, অন্যের বিনা প্ররোচনায় নিম্নোক্ত স্বাক্ষীগণের উপস্থিতিতে অদ্য <span className="font-bold text-gray-900">{data.date || '০৮/০৮/২০২৬'}</span>ইং তারিখ অত্র চুক্তিনামায় স্বাক্ষর প্রদান করছি।
      </p>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-300 font-sans text-xs">
        <div>
          <div className="font-bold mb-12">অটোমেট আইটি লিমিটেড এর পক্ষে</div>
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold text-gray-900">আতিকুর রহমান</p>
            <p className="text-gray-600">ম্যানেজার, বিজনেস অপারেশন্স</p>
            <p className="mt-6 text-[11px] text-gray-500">স্বাক্ষী- ………………………………………………………………..</p>
          </div>
        </div>

        <div>
          <div className="font-bold mb-12">“{data.instituteName || 'শিক্ষা প্রতিষ্ঠান'}” এর পক্ষে</div>
          <div className="border-t border-gray-400 pt-2">
            <p className="font-bold text-gray-900">নামঃ {data.headName || '—'}</p>
            <p className="text-gray-600">পদবীঃ {data.designation || '—'}</p>
            <p className="mt-6 text-[11px] text-gray-500">স্বাক্ষী- ………………………………………………………………..</p>
          </div>
        </div>
      </div>
    </div>
  );
};
