import React from 'react';
import { InstituteAgreementData, BankDetails } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const SPGSplitAccountDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const designation = data.designation || 'Principal';
  const instituteName = data.instituteName || '—';
  const headMobile = data.headMobile || '—';
  const instituteEmail = data.instituteEmail || '—';

  // Bank branch & bank name
  const bankName = data.bankDetails?.bankName || data.bankAccounts?.[0]?.bankName || 'Sonali Bank PLC';
  const branchName = data.bankDetails?.branchName || data.bankAccounts?.[0]?.branchName || '—';

  // Bank accounts list
  const accounts: BankDetails[] = (data.bankAccounts && data.bankAccounts.length > 0)
    ? data.bankAccounts
    : [
        {
          feeHeadName: 'Tuition Fees, Admission Fee',
          accountName: data.bankDetails?.accountName || instituteName,
          accountNumber: data.bankDetails?.accountNumber || '—',
          bankName: data.bankDetails?.bankName || 'Sonali Bank PLC',
          branchName: data.bankDetails?.branchName || '—',
          routingNumber: data.bankDetails?.routingNumber || '—',
          bankAddress: data.bankDetails?.bankAddress || '—'
        }
      ];

  const isCollege = designation.toLowerCase().includes('principal') || 
                    designation.includes('অধ্যক্ষ') || 
                    instituteName.toLowerCase().includes('college') || 
                    instituteName.includes('কলেজ');
  const accountCategoryLabel = isCollege ? 'College Accounts' : 'School Accounts';

  return (
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-8 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-6 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Date Header if available */}
      {data.date && (
        <div className="text-right text-xs mb-4 text-black font-mono">
          Date: {data.date}
        </div>
      )}

      {/* Recipient */}
      <div className="mb-5 space-y-0.5 text-xs text-black leading-relaxed">
        <p className="font-bold text-black">To</p>
        <p className="font-bold text-black">The General Manager</p>
        <p className="font-semibold text-black">Government Services Division</p>
        <p className="text-black">Sonali Bank PLC</p>
      </div>

      {/* Subject */}
      <div className="mb-5 font-bold text-xs sm:text-sm text-black leading-snug">
        Subject: Request for Direct Fund Transfer to Respective Account as per Designated Heads.
      </div>

      {/* Salutation */}
      <div className="mb-4 text-xs font-semibold text-black">
        Dear Sir/Madam,
      </div>

      {/* Body Paragraphs */}
      <div className="space-y-4 text-justify text-xs leading-relaxed text-black">
        <p>
          We respectfully wish to bring to your kind attention that <span className="font-bold text-black">{instituteName}</span> collects funds under various heads such as Tuition Fee, Admission Fee, Examination Fee, etc. The financial transactions of our institution are managed through the Academy IMS software, provided by Automate IT Limited as our authorized service provider.
        </p>

        <p>
          In this regard, we would like to inform you that it is necessary to arrange for the funds collected under each designated head to be transferred directly and automatically to the respective bank account mentioned below.
        </p>

        {/* Account Details Section */}
        <div className="pt-2">
          <p className="font-bold text-xs underline mb-1">Account Details:</p>
          <p className="font-semibold text-xs mb-2 text-black">{accountCategoryLabel}</p>

          <table className="w-full border-collapse border border-black text-xs text-black mb-4">
            <thead>
              <tr className="bg-gray-50 border-b border-black text-left font-bold">
                <th className="p-2 border-r border-black w-2/5">Fee Head Name</th>
                <th className="p-2 border-r border-black w-2/5">Account Name</th>
                <th className="p-2 w-1/5">Account Number</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, idx) => (
                <tr key={idx} className={idx < accounts.length - 1 ? 'border-b border-black' : ''}>
                  <td className="p-2 border-r border-black align-top font-medium">
                    {acc.feeHeadName || `Head #${idx + 1}`}
                  </td>
                  <td className="p-2 border-r border-black align-top">
                    {acc.accountName || '—'}
                  </td>
                  <td className="p-2 align-top font-mono">
                    {acc.accountNumber || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Therefore, we humbly request your kind authority to issue necessary instructions to arrange for the automatic and direct transfer of funds collected under the above-mentioned heads to the specified account. This will ensure transparent and efficient financial management of our institution.
        </p>

        {/* Closing & Signoff */}
        <div className="pt-6">
          <p className="mb-10 font-medium">Yours faithfully,</p>
          
          <div className="space-y-0.5 text-xs text-black max-w-sm">
            <div className="w-48 border-b border-black mb-2"></div>
            <p className="font-bold text-black">{designation}</p>
            <p className="font-semibold text-black">{instituteName}</p>
            <p className="text-black font-mono">Mobile: {headMobile}</p>
            <p className="text-black">Email: {instituteEmail}</p>
          </div>
        </div>

        {/* CC List */}
        <div className="pt-6 text-xs text-black leading-relaxed">
          <p className="font-bold mb-1">CC:</p>
          <ol className="list-none space-y-0.5 pl-1 text-black">
            <li>1. Automate IT Limited (Service Provider)</li>
            <li>2. {branchName} Branch, {bankName}</li>
            <li>3. Office File</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
