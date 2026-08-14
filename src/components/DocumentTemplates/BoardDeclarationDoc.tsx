import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const BoardDeclarationDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const directors = (data.boardDirectors && data.boardDirectors.length > 0)
    ? data.boardDirectors
    : [
        {
          name: data.headName || '—',
          dob: '—',
          nationality: 'Bangladeshi',
          nid: '—'
        }
      ];

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient Header */}
      <div className="mb-4 text-xs text-black leading-relaxed">
        <p className="font-bold text-black">To</p>
        <p className="font-semibold text-black">Head of Education Payment</p>
        <p className="text-black">bKash Limited</p>
        <p className="text-black">Bir Sreshtha Shaheed Jahangir Gate</p>
        <p className="text-black">546, Dhaka Cantonment, Dhaka-1206</p>
        <p className="mt-2 font-medium text-black">
          <span className="font-bold">Attention:</span> Naimul Hossain Durjoy, Relationship Executive
        </p>
      </div>

      {/* Title */}
      <div className="text-center my-4">
        <h1 className="text-xs font-bold uppercase text-black">
          Declaration of Personal Details of Board of Directors
        </h1>
      </div>

      {/* Main Body */}
      <div className="space-y-4 text-justify text-xs text-black leading-relaxed">
        <p>
          I, <span className="font-bold text-black">{data.headName || 'Headmaster / Principal Name'}</span> , <span className="font-semibold text-black">{data.designation || 'Designation'}</span> authorized by the Institution Account holder of <span className="font-bold text-black">{data.instituteName || 'Institute Name'}</span> is hereby providing the details of the members of the board of directors of the organization.
        </p>

        {/* Board Directors Information Table */}
        <div className="my-3">
          <table className="w-full border-collapse border border-black text-xs text-black">
            <thead>
              <tr className="bg-white border-b border-black text-left font-bold">
                <th className="p-1.5 w-10 border-r border-black text-center">SL</th>
                <th className="p-1.5 border-r border-black">Name</th>
                <th className="p-1.5 border-r border-black">Date of Birth</th>
                <th className="p-1.5 border-r border-black">Nationality</th>
                <th className="p-1.5">NID Number</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((dir, idx) => (
                <tr key={idx} className={idx < directors.length - 1 ? "border-b border-black" : ""}>
                  <td className="p-1.5 text-center font-bold border-r border-black">{idx + 1}</td>
                  <td className="p-1.5 border-r border-black font-medium">{dir.name || '—'}</td>
                  <td className="p-1.5 border-r border-black">{dir.dob || '—'}</td>
                  <td className="p-1.5 border-r border-black">{dir.nationality || 'Bangladeshi'}</td>
                  <td className="p-1.5 font-mono">{dir.nid || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legal Declaration */}
        <p>
          I do hereby declare that all the information provided herewith is true, correct and complete to the best of my knowledge and belief. Further, I promise that the complete personal details including Photo IDs (NID/Driving License/Passport) of the above mentioned members of board of directors will be provided to bKash Limited if and when required by bKash to fulfil regulatory instructions and/or for internal compliance purpose. I shall be liable if I am found to have provided any false information.
        </p>

        {/* Signature Section */}
        <div className="pt-6">
          <table className="w-full border-collapse border border-black text-xs text-black">
            <thead>
              <tr className="bg-white border-b border-black font-bold">
                <th className="p-2 text-left w-1/3 border-r border-black">Name</th>
                <th className="p-2 text-left w-1/3 border-r border-black">Position</th>
                <th className="p-2 text-left w-1/3">Signature and Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-left align-top font-bold border-r border-black">
                  {data.headName || 'Headmaster / Principal Name'}
                </td>
                <td className="p-2 text-left align-top font-medium border-r border-black">
                  {data.designation || 'Designation'}
                </td>
                <td className="p-2 text-left align-top">
                  <div className="h-10"></div>
                  <div className="font-semibold text-black">{data.instituteName || 'Institute Name'}</div>
                  <div className="text-[11px] text-black">Date: {data.date || '08/08/2026'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
