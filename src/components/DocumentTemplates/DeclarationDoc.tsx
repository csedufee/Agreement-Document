import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const DeclarationDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  return (
    <div className="bg-white text-gray-900 font-sans text-xs leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-8 flex items-center justify-center text-gray-400 text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Header Title */}
      <div className="text-center mb-6 pb-2 border-b-2 border-gray-800">
        <h1 className="text-sm font-bold uppercase tracking-tight text-gray-900">
          Declaration of Personal Details of Members of Board of Trustees / Syndicate / Managing Committee / Governing Body
        </h1>
      </div>

      <div className="space-y-4 text-justify">
        <p>
          I, <span className="font-bold">{data.headName || '—'}</span>, <span className="font-semibold">{data.designation || '—'}</span> authorized by the Private Educational Institution Account holder of <span className="font-bold">{data.instituteName || '—'}</span> is hereby providing the details of the members of Board of Trustees/Managing Committee/governing Body.
        </p>

        {/* Member Table */}
        <table className="w-full border-collapse border border-gray-300 text-xs my-4">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-2 border-r border-gray-300 w-12 text-center">SL</th>
              <th className="p-2 text-left">Name & Designation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="p-2 border-r border-gray-300 text-center font-bold">1</td>
              <td className="p-2 font-medium">
                {data.headName || '—'}, {data.designation || '—'}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="leading-relaxed">
          I do hereby declare that all the information provided herewith is true, correct and complete to the best of my knowledge and belief. Further, I promise that the complete personal details including Photo IDs (NID/Driving License/Passport) of the above mentioned members of Managing Committee/Governing Body will be provided to bKash Limited if and when required by bKash to fulfil regulatory instructions and/or for internal compliance purpose. I shall be liable if I am found to have provided any false information.
        </p>

        {/* Signature Table */}
        <div className="pt-8">
          <table className="w-full border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 text-left w-1/3">Name</th>
                <th className="p-2 border-r border-gray-300 text-left w-1/3">Position</th>
                <th className="p-2 text-left w-1/3">Signature and Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-r border-gray-300 font-bold">{data.headName || '—'}</td>
                <td className="p-3 border-r border-gray-300 font-medium">{data.designation || '—'}</td>
                <td className="p-3 text-gray-400">
                  <div className="h-10"></div>
                  <div className="border-t border-gray-300 pt-1 text-[10px]">Date: {data.date || '08/08/2026'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
