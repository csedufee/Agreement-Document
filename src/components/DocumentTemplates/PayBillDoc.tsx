import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const PayBillDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
  const bankAccounts = (data.bankAccounts && data.bankAccounts.length > 0)
    ? data.bankAccounts
    : [data.bankDetails || {
        bankName: '',
        accountName: '',
        accountNumber: '',
        branchName: '',
        routingNumber: '',
        bankAddress: ''
      }];

  return (
    <div className="bg-white text-gray-900 font-sans text-xs leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-8 flex items-center justify-center text-gray-400 text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-4">
        <p className="font-bold">To</p>
        <p className="font-bold">Head of Business Sales</p>
        <p className="font-bold">bKash Limited</p>
        <p>Bir Sreshtha Shaheed Jahangir Gate</p>
        <p>546, Dhaka Cantonment, Dhaka-1206</p>
      </div>

      <div className="mb-4 font-semibold text-gray-700">
        Attention: Naimul Hossain Durjoy, Business Development Executive
      </div>

      <div className="mb-6 font-bold text-sm bg-gray-50 p-3 rounded border border-gray-300">
        Subject: Letter of Interest, Introduction and Authorization.
      </div>

      <div className="space-y-4 text-justify">
        <p>Dear Sir,</p>
        <p>
          We are glad to inform you that, in reference to our meeting in our office <span className="font-semibold">{data.instituteAddress || '—'}</span> dated <span className="font-semibold">{data.date || '08/08/2026'}</span> we <span className="font-bold">{data.instituteName || '—'}</span> have decided to use the collection solution of bKash.
        </p>

        <p>To Collect and settle the collected amount, we would like to use the below Mobile Number and Bank Account:</p>

        {/* Table of PayBill Details */}
        {(() => {
          const CHUNK_SIZE = 3;
          const bankChunks = [];
          for (let i = 0; i < bankAccounts.length; i += CHUNK_SIZE) {
            bankChunks.push(bankAccounts.slice(i, i + CHUNK_SIZE));
          }

          return bankChunks.map((chunk, chunkIdx) => {
            const hasFeeHead = chunk.some((b) => !!b.feeHeadName);

            return (
              <div key={chunkIdx} className={chunkIdx > 0 ? "mt-3" : "mb-4"}>
                {bankChunks.length > 1 && (
                  <div className="font-bold text-xs bg-gray-100 p-1.5 border border-gray-300 border-b-0 text-gray-700">
                    Bank Accounts Group #{chunkIdx + 1}
                  </div>
                )}
                <table className="w-full border-collapse border border-gray-300 text-xs">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="p-2 border-r border-gray-300 text-left bg-gray-200/70 font-bold min-w-[120px]">Field</th>
                      {chunk.map((b, idx) => {
                        const globalIdx = chunkIdx * CHUNK_SIZE + idx;
                        const labelNumber = globalIdx + 1;
                        return (
                          <th key={idx} className="p-2 border-r border-gray-300 text-left">
                            {labelNumber}: Institution’s Bank Ac #{labelNumber} {globalIdx === 0 ? '(Primary)' : ''}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {hasFeeHead && (
                      <tr className="border-b border-gray-300">
                        <td className="p-2 bg-indigo-50 font-semibold border-r border-gray-300 text-indigo-900">Fee Head Name (ফি হেড)</td>
                        {chunk.map((b, idx) => (
                          <td key={idx} className="p-2 border-r border-gray-300 font-bold text-indigo-900">
                            {b.feeHeadName || '—'}
                          </td>
                        ))}
                      </tr>
                    )}
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Mobile Number (bKash Account)</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-mono font-bold text-pink-700">
                          {data.payBillNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">bKash Merchant Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-bold">
                          {data.instituteName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Bank Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-bold">
                          {b.bankName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Branch</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300">
                          {b.branchName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Branch Routing Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-mono">
                          {b.routingNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Account Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-bold">
                          {b.accountName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Account Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-mono font-bold">
                          {b.accountNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Customer Convenience Fees</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 border-r border-gray-300 font-bold text-gray-900">
                          1.3%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          });
        })()}

        {/* Contact Person */}
        <div className="border border-gray-300 p-3 bg-gray-50 rounded">
          <p className="font-bold text-xs border-b border-gray-300 pb-1 mb-2">Designated Contact Person</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div><span className="font-semibold">Name:</span> {data.headName || '—'}</div>
            <div><span className="font-semibold">Contact:</span> {data.headMobile || '—'}</div>
            <div><span className="font-semibold">Email:</span> {data.instituteEmail || '—'}</div>
          </div>
        </div>

        <p>Therefore, please take necessary steps from your end to activate the corporate bKash Account.</p>
        <p className="pt-2">Thanking You,</p>

        {/* Signature */}
        <div className="pt-12 border-t border-gray-400 max-w-xs mt-8">
          <p className="font-bold">Name: {data.headName || '—'}</p>
          <p className="text-gray-700">Designation: {data.designation || '—'}</p>
          <p className="font-semibold text-gray-900">{data.instituteName || '—'}</p>
          <p className="text-xs text-gray-400 mt-2">[ Signature & Official Stamp ]</p>
        </div>
      </div>
    </div>
  );
};
