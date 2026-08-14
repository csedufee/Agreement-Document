import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const DeclarationDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Header Title */}
      <div className="text-center mb-4 pb-1.5">
        <h1 className="text-xs font-bold uppercase tracking-tight text-black">
          Declaration of Personal Details of Members of Board of Trustees / Syndicate / Managing Committee / Governing Body
        </h1>
      </div>

      <div className="space-y-3 text-justify text-xs text-black">
        <p>
          I, <span className="font-bold text-black">{data.headName || '—'}</span>, <span className="font-semibold text-black">{data.designation || '—'}</span> authorized by the Private Educational Institution Account holder of <span className="font-bold text-black">{data.instituteName || '—'}</span> is hereby providing the details of the members of Board of Trustees/Managing Committee/governing Body.
        </p>

        {/* Member Table */}
        <table className="w-full border-collapse border border-black text-xs my-3 text-black">
          <thead>
            <tr className="bg-white border-b border-black">
              <th className="p-1.5 w-10 text-left align-middle text-black">SL</th>
              <th className="p-1.5 text-left align-middle text-black">Name & Designation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black">
              <td className="p-1.5 text-left align-middle font-bold text-black">1</td>
              <td className="p-1.5 text-left align-middle font-medium text-black">
                {data.headName || '—'}, {data.designation || '—'}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="leading-relaxed text-black">
          I do hereby declare that all the information provided herewith is true, correct and complete to the best of my knowledge and belief. Further, I promise that the complete personal details including Photo IDs (NID/Driving License/Passport) of the above mentioned members of Managing Committee/Governing Body will be provided to bKash Limited if and when required by bKash to fulfil regulatory instructions and/or for internal compliance purpose. I shall be liable if I am found to have provided any false information.
        </p>

        {/* Signature Table */}
        <div className="pt-4">
          <table className="w-full border-collapse border border-black text-xs text-black">
            <thead>
              <tr className="bg-white border-b border-black">
                <th className="p-1.5 text-left align-middle w-1/3 text-black">Name</th>
                <th className="p-1.5 text-left align-middle w-1/3 text-black">Position</th>
                <th className="p-1.5 text-left align-middle w-1/3 text-black">Signature and Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-left align-middle font-bold text-black">{data.headName || '—'}</td>
                <td className="p-2 text-left align-middle font-medium text-black">{data.designation || '—'}</td>
                <td className="p-2 text-left align-middle text-black">
                  <div className="h-8"></div>
                  <div className="pt-0.5 text-[10px] text-black">Date: {data.date || '08/08/2026'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
