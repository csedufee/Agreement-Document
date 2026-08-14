import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const DynamicChargingDoc: React.FC<Props> = ({ data, showPadHeaderSpace = true }) => {
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
      {/* Pad Clearance */}
      {showPadHeaderSpace && (
        <div className="h-20 border border-dashed border-black mb-3 flex items-center justify-center text-black text-xs pad-space-box">
          <span className="pad-space-label no-print">[ প্রতিষ্ঠান লেটারহেড প্যাড এর জন্য নির্ধারিত ফাঁকা জায়গা ]</span>
        </div>
      )}

      {/* Recipient */}
      <div className="mb-2 text-black text-xs">
        <p className="font-bold">To</p>
        <p className="font-bold">Head of Business Sales</p>
        <p className="font-bold">bKash Limited</p>
        <p>Bir Sreshtha Shaheed Jahangir Gate</p>
        <p>546, Dhaka Cantonment, Dhaka-1206</p>
      </div>

      <div className="mb-2 font-semibold text-black text-xs">
        Attention: Naimul Hossain Durjoy, Business Development Executive
      </div>

      <div className="mb-3 font-bold text-xs bg-white p-2 rounded border border-black text-black">
        Subject: Letter of Interest, Introduction and Authorization (Dynamic Charging).
      </div>

      <div className="space-y-2 text-justify text-xs text-black">
        <p>Dear Sir,</p>
        <p>
          We are glad to inform you that, in reference to our meeting in our office <span className="font-semibold text-black">{data.instituteAddress || '—'}</span> dated <span className="font-semibold text-black">{data.date || '08/08/2026'}</span> we <span className="font-bold text-black">{data.instituteName || '—'}</span> have decided to use the collection solution of bKash.
        </p>

        <p>To Collect and settle the collected amount, we would like to use the below Mobile Number and Bank Account:</p>

        {/* Table of Dynamic Charging Details */}
        {(() => {
          const CHUNK_SIZE = 3;
          const bankChunks = [];
          for (let i = 0; i < bankAccounts.length; i += CHUNK_SIZE) {
            bankChunks.push(bankAccounts.slice(i, i + CHUNK_SIZE));
          }

          return bankChunks.map((chunk, chunkIdx) => {
            const hasFeeHead = chunk.some((b) => !!b.feeHeadName);

            return (
              <div key={chunkIdx} className={chunkIdx > 0 ? "mt-2" : "mb-2"}>
                {bankChunks.length > 1 && (
                  <div className="font-bold text-[11px] bg-white p-1 border border-black border-b-0 text-black">
                    Bank Accounts Group #{chunkIdx + 1}
                  </div>
                )}
                <table className="w-full border-collapse border border-black text-[11px] text-black">
                  <thead>
                    <tr className="bg-white border-b border-black">
                      <th className="p-1 px-1.5 text-left align-middle font-bold min-w-[100px] text-black">Field</th>
                      {chunk.map((b, idx) => {
                        const globalIdx = chunkIdx * CHUNK_SIZE + idx;
                        const labelNumber = globalIdx + 1;
                        return (
                          <th key={idx} className="p-1 px-1.5 text-left align-middle text-black">
                            {labelNumber}: Bank Ac #{labelNumber} {globalIdx === 0 ? '(Primary)' : ''}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {hasFeeHead && (
                      <tr className="border-b border-black">
                        <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Fee Head Name (ফি হেড)</td>
                        {chunk.map((b, idx) => (
                          <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                            {b.feeHeadName || '—'}
                          </td>
                        ))}
                      </tr>
                    )}
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Mobile Number (bKash Account)</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-mono font-bold text-black">
                          {data.dynamicChargeNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">bKash Merchant Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                          {data.instituteName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Bank Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                          {b.bankName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Branch</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle text-black">
                          {b.branchName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Branch Routing Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-mono text-black">
                          {b.routingNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Account Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                          {b.accountName || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Account Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-mono font-bold text-black">
                          {b.accountNumber || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-1 px-1.5 text-left align-middle bg-white font-semibold text-black">Dynamic Charging</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-1 px-1.5 text-left align-middle font-bold text-black">
                          Dynamic Charging Enabled
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
        <div className="border border-black p-2 bg-white rounded text-black my-1">
          <p className="font-bold text-[11px] pb-0.5 mb-1 text-black">Designated Contact Person</p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-black">
            <div><span className="font-semibold text-black">Name:</span> {data.headName || '—'}</div>
            <div><span className="font-semibold text-black">Contact:</span> {data.headMobile || '—'}</div>
            <div><span className="font-semibold text-black">Email:</span> {data.instituteEmail || '—'}</div>
          </div>
        </div>

        <p className="text-black">Therefore, please take necessary steps from your end to activate the corporate bKash Account.</p>
        <p className="pt-1 text-black">Thanking You,</p>

        {/* Signature */}
        <div className="pt-6 max-w-xs mt-4 text-black">
          <p className="font-bold text-xs text-black">Name: {data.headName || '—'}</p>
          <p className="text-black font-medium">Designation: {data.designation || '—'}</p>
          <p className="font-semibold text-black">{data.instituteName || '—'}</p>
        </div>
      </div>
    </div>
  );
};
