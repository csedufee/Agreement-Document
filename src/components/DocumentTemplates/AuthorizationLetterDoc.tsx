import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const AuthorizationLetterDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
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
    <div className="bg-white text-gray-900 font-serif text-xs leading-relaxed p-10 max-w-[800px] mx-auto printable-document">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-28 border-b border-dashed border-gray-300 mb-8 flex items-center justify-center text-gray-400 text-xs font-sans pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-6 font-sans">
        <p className="font-bold">To:</p>
        <p className="font-bold">Chief Operating Officer,</p>
        <p>Software Shop Limited</p>
        <p>93 B, New Eskaton Road, Dhaka-1000, Bangladesh</p>
      </div>

      {/* Subject */}
      <div className="mb-6 font-sans font-bold text-sm bg-gray-50 p-3 rounded border border-gray-300">
        Sub: Authorization Letter for Providing Online Payment Gateway Service (SSLCOMMERZ)
      </div>

      {/* Body */}
      <div className="space-y-4 text-justify font-sans">
        <p>Dear Sir,</p>
        <p>
          I, the undersigned, authorize, appoint, and engage Software Shop Limited (SSL) to provide Online Payment Gateway Service (SSLCOMMERZ) to my institution. Until further notice from us, SSL shall collect the payments made by our service takers/payers on our behalf and settle our part of the payments to our bank account provided in point 4 below. We also authorize the Vendor/EMS to deduct and settle their service charge as specified in the agreement from the total transacted amount to their designated company bank account. We also acknowledge and agree to the following:
        </p>

        <ol className="list-decimal pl-5 space-y-3 font-sans">
          <li>We shall comply with all laws and regulations in force in Bangladesh for our administration and operation.</li>
          <li>We indemnify and hold SSL harmless from and against any and all claims, disputes, losses, and damages arising from and out of any act/omission by our institution and/or for any reason whatsoever. However, SSL shall remain responsible for its own acts or omissions and indemnify us in case of any issues that arise due to SSL's actions.</li>
          <li>We will abide by the terms and conditions of the Merchant Enrolment Form that will be signed between Software Shop Limited and our institution.</li>
          <li>
            <p className="font-semibold mb-2">Bank Account Details:</p>
            {(() => {
              const CHUNK_SIZE = 3;
              const bankChunks = [];
              for (let i = 0; i < bankAccounts.length; i += CHUNK_SIZE) {
                bankChunks.push(bankAccounts.slice(i, i + CHUNK_SIZE));
              }

              return bankChunks.map((chunk, chunkIdx) => {
                const hasFeeHead = chunk.some((b) => !!b.feeHeadName);
                const isFirstChunk = chunkIdx === 0;

                return (
                  <div key={chunkIdx} className={chunkIdx > 0 ? "mt-3" : ""}>
                    {bankChunks.length > 1 && (
                      <div className="font-bold text-xs bg-gray-100 p-1.5 border border-gray-300 border-b-0 text-gray-700">
                        Bank Accounts Group #{chunkIdx + 1}
                      </div>
                    )}
                    <table className="w-full border-collapse border border-gray-300 text-xs">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="p-2 border-r border-gray-300 text-left bg-gray-200/70 font-bold min-w-[90px]">Field</th>
                          {chunk.map((b, idx) => {
                            const globalIdx = chunkIdx * CHUNK_SIZE + idx;
                            const labelNumber = globalIdx + 1;
                            return (
                              <th key={idx} className="p-2 border-r border-gray-300 text-left">
                                {labelNumber}: Institution’s Bank Ac #{labelNumber} {globalIdx === 0 ? '(Primary)' : ''}
                              </th>
                            );
                          })}
                          {isFirstChunk && (
                            <th className="p-2 text-left bg-amber-50/90 font-bold text-amber-950">
                              {chunk.length + 1}: EMS Vendor Bank Ac Details
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {hasFeeHead && (
                          <tr className="border-b border-gray-300">
                            <td className="p-2 bg-indigo-50 font-semibold border-r border-gray-300 text-indigo-900">Fee Head Name</td>
                            {chunk.map((b, idx) => (
                              <td key={idx} className="p-2 border-r border-gray-300 font-bold text-indigo-900">
                                {b.feeHeadName || '—'}
                              </td>
                            ))}
                            {isFirstChunk && <td className="p-2 text-gray-400">—</td>}
                          </tr>
                        )}
                        <tr className="border-b border-gray-300">
                          <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Bank Name</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-2 border-r border-gray-300 font-bold">
                              {b.bankName || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-2 font-bold">United Commercial Bank PLC(UCB)</td>}
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Bank Acc Name</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-2 border-r border-gray-300 font-bold">
                              {b.accountName || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-2 font-bold">Edumate Technology</td>}
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Bank Acc Number</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-2 border-r border-gray-300 font-mono font-bold">
                              {b.accountNumber || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-2 font-mono font-bold">1262112000001952</td>}
                        </tr>
                        <tr>
                          <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Routing Number</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-2 border-r border-gray-300 font-mono">
                              {b.routingNumber || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-2 font-mono">245260726</td>}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              });
            })()}
          </li>
          <li>
            SSLCOMMERZ shall waive the one-time setup fee of <span className="line-through font-semibold text-red-600 px-0.5 decoration-2">BDT 25,500/-</span>. A Transaction Discount Rate (TDR) of 1.50% will apply to all transactions across available payment channels.
          </li>
        </ol>

        <p className="pt-4">Thanking you,</p>
        <p>Yours faithfully,</p>

        {/* Signature Area */}
        <div className="pt-12 border-t border-gray-300 max-w-xs mt-8">
          <p className="font-bold">Name: {data.headName || '—'}</p>
          <p className="text-gray-700">Title: {data.designation || '—'}</p>
          <p className="font-semibold text-gray-900">Institution Name: {data.instituteName || '—'}</p>
          <p className="text-xs text-gray-400 mt-4">[ Signature & Official Seal ]</p>
        </div>
      </div>
    </div>
  );
};
