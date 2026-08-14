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
    <div className="bg-white text-black font-sans text-xs leading-normal p-6 sm:p-7 max-w-[800px] mx-auto printable-document single-page-doc">
      {/* Pad Clearance Space */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-4 flex items-center justify-center text-black text-xs font-sans pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-3 font-sans text-black text-xs">
        <p className="font-bold">To:</p>
        <p className="font-bold">Chief Operating Officer,</p>
        <p>Software Shop Limited</p>
        <p>93 B, New Eskaton Road, Dhaka-1000, Bangladesh</p>
      </div>

      {/* Subject */}
      <div className="mb-3 font-sans font-bold text-xs bg-white p-2 rounded border border-black text-black">
        Sub: Authorization Letter for Providing Online Payment Gateway Service (SSLCOMMERZ)
      </div>

      {/* Body */}
      <div className="space-y-2 text-justify font-sans text-xs text-black">
        <p>Dear Sir,</p>
        <p>
          I, the undersigned, authorize, appoint, and engage Software Shop Limited (SSL) to provide Online Payment Gateway Service (SSLCOMMERZ) to my institution. Until further notice from us, SSL shall collect the payments made by our service takers/payers on our behalf and settle our part of the payments to our bank account provided in point 4 below. We also authorize the Vendor/EMS to deduct and settle their service charge as specified in the agreement from the total transacted amount to their designated company bank account. We also acknowledge and agree to the following:
        </p>

        <ol className="list-decimal pl-4 space-y-1.5 font-sans text-xs text-black">
          <li>We shall comply with all laws and regulations in force in Bangladesh for our administration and operation.</li>
          <li>We indemnify and hold SSL harmless from and against any and all claims, disputes, losses, and damages arising from and out of any act/omission by our institution and/or for any reason whatsoever. However, SSL shall remain responsible for its own acts or omissions and indemnify us in case of any issues that arise due to SSL's actions.</li>
          <li>We will abide by the terms and conditions of the Merchant Enrolment Form that will be signed between Software Shop Limited and our institution.</li>
          <li>
            <p className="font-semibold mb-1 text-black">Bank Account Details:</p>
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
                  <div key={chunkIdx} className={chunkIdx > 0 ? "mt-2" : ""}>
                    {bankChunks.length > 1 && (
                      <div className="font-bold text-[11px] bg-white p-1 border border-black border-b-0 text-black">
                        Bank Accounts Group #{chunkIdx + 1}
                      </div>
                    )}
                    <table className="w-full border-collapse border border-black text-[11px] text-black">
                      <thead>
                        <tr className="bg-white border-b border-black">
                          <th className="p-1 px-1.5 text-left align-middle font-bold min-w-[80px] text-black">Field</th>
                          {chunk.map((b, idx) => {
                            const globalIdx = chunkIdx * CHUNK_SIZE + idx;
                            const labelNumber = globalIdx + 1;
                            return (
                              <th key={idx} className="p-1 px-1.5 text-left align-middle text-black">
                                {labelNumber}: Bank Ac #{labelNumber} {globalIdx === 0 ? '(Primary)' : ''}
                              </th>
                            );
                          })}
                          {isFirstChunk && (
                            <th className="p-1 px-1.5 text-left align-middle font-bold text-black">
                              {chunk.length + 1}: EMS Vendor Bank Ac
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {hasFeeHead && (
                          <tr className="border-b border-black">
                            <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Fee Head Name</td>
                            {chunk.map((b, idx) => (
                              <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                                {b.feeHeadName || '—'}
                              </td>
                            ))}
                            {isFirstChunk && <td className="p-1 px-1.5 text-left align-middle text-black">—</td>}
                          </tr>
                        )}
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Bank Name</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                              {b.bankName || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-1 px-1.5 text-left align-middle font-bold text-black">United Commercial Bank PLC(UCB)</td>}
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Bank Acc Name</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                              {b.accountName || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-1 px-1.5 text-left align-middle font-bold text-black">Edumate Technology</td>}
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Bank Acc Number</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-1 px-1.5 text-left align-middle font-mono font-bold text-black">
                              {b.accountNumber || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-1 px-1.5 text-left align-middle font-mono font-bold text-black">1262112000001952</td>}
                        </tr>
                        <tr>
                          <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Routing Number</td>
                          {chunk.map((b, idx) => (
                            <td key={idx} className="p-1 px-1.5 text-left align-middle font-mono text-black">
                              {b.routingNumber || '—'}
                            </td>
                          ))}
                          {isFirstChunk && <td className="p-1 px-1.5 text-left align-middle font-mono text-black">245260726</td>}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              });
            })()}
          </li>
          <li>
            SSLCOMMERZ shall waive the one-time setup fee of <span className="line-through font-semibold text-black px-0.5 decoration-2">BDT 25,500/-</span>. A Transaction Discount Rate (TDR) of 1.50% will apply to all transactions across available payment channels.
          </li>
        </ol>

        <p className="pt-2 text-black">Thanking you,</p>
        <p className="text-black">Yours faithfully,</p>

        {/* Signature Area */}
        <div className="pt-6 max-w-xs mt-4 text-black">
          <p className="font-bold text-black">Name: {data.headName || '—'}</p>
          <p className="text-black">Title: {data.designation || '—'}</p>
          <p className="font-semibold text-black">Institution Name: {data.instituteName || '—'}</p>
        </div>
      </div>
    </div>
  );
};
