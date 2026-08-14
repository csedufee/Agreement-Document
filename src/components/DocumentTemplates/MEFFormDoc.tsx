import React from 'react';
import { InstituteAgreementData } from '../../types';

interface Props {
  data: InstituteAgreementData;
  showPadHeaderSpace?: boolean;
}

export const MEFFormDoc: React.FC<Props> = ({ data }) => {
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
    <div className="bg-white text-black font-sans text-xs leading-normal p-8 max-w-[850px] mx-auto printable-document">
      {/* Main Form Title */}
      <div className="text-center mb-6 pb-2">
        <h1 className="text-xl font-bold uppercase tracking-wide text-black">MERCHANT ENROLMENT FORM (MEF)</h1>
        <p className="text-xs font-medium text-black">SSLCOMMERZ Payment Gateway System</p>
      </div>

      {/* Company Profile */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Company Profile</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Institution Name</td>
              <td className="p-2 font-bold text-black">{data.instituteName || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Registered Address</td>
              <td className="p-2 text-black">{data.instituteAddress || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Contact Number</td>
              <td className="p-2 text-black">{data.headMobile || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">E-mail Address</td>
              <td className="p-2 text-black">{data.instituteEmail || '—'}</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">Merchant Type</td>
              <td className="p-2 font-medium text-black">Online/Website</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Single Point of Contact's Information */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Single Point of Contact's Information</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Contact Person's Name</td>
              <td className="p-2 text-black">{data.headName || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">E-mail Address</td>
              <td className="p-2 text-black">{data.instituteEmail || '—'}</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">Mobile Number</td>
              <td className="p-2 text-black">{data.headMobile || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ownership / Signatory / Authorized Person Information */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Ownership / Signatory / Authorized Person Information</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Full Name</td>
              <td className="p-2 text-black">{data.headName || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">NID Number</td>
              <td className="p-2 font-mono text-black">{data.headNid || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">E-mail Address</td>
              <td className="p-2 text-black">{data.instituteEmail || '—'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Mobile Number</td>
              <td className="p-2 text-black">{data.headMobile || '—'}</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">DOB.</td>
              <td className="p-2 text-black">{data.headDob || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Board of Directors Information (For Private Institutions) */}
      {data.boardDirectors && data.boardDirectors.length > 0 && (
        <div className="mb-6">
          <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Board of Directors Information</h2>
          <table className="w-full border-collapse border border-black text-xs text-black">
            <thead>
              <tr className="bg-white border-b border-black">
                <th className="p-2 text-center align-middle font-bold w-12 border-r border-black">SL</th>
                <th className="p-2 text-left align-middle font-bold border-r border-black">Director Name</th>
                <th className="p-2 text-left align-middle font-bold border-r border-black">Date of Birth</th>
                <th className="p-2 text-left align-middle font-bold border-r border-black">Nationality</th>
                <th className="p-2 text-left align-middle font-bold">NID Number</th>
              </tr>
            </thead>
            <tbody>
              {data.boardDirectors.map((dir, idx) => (
                <tr key={idx} className={idx < data.boardDirectors!.length - 1 ? "border-b border-black" : ""}>
                  <td className="p-2 text-center font-bold border-r border-black">{idx + 1}</td>
                  <td className="p-2 font-medium border-r border-black">{dir.name || '—'}</td>
                  <td className="p-2 border-r border-black">{dir.dob || '—'}</td>
                  <td className="p-2 border-r border-black">{dir.nationality || 'Bangladeshi'}</td>
                  <td className="p-2 font-mono">{dir.nid || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Merchant's Banking Information */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Merchant's Banking Information</h2>
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
              <div key={chunkIdx} className={chunkIdx > 0 ? "mt-4" : ""}>
                {bankChunks.length > 1 && (
                  <div className="font-bold text-xs bg-white p-1.5 border border-black border-b-0 text-black">
                    Bank Accounts Group #{chunkIdx + 1}
                  </div>
                )}
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-white border-b border-black">
                      <th className="p-2 text-left align-middle font-bold min-w-[100px] text-black">Field</th>
                      {chunk.map((b, idx) => {
                        const globalIdx = chunkIdx * CHUNK_SIZE + idx;
                        const labelNumber = globalIdx + 1;
                        return (
                          <th key={idx} className="p-2 text-left align-middle text-black">
                            {labelNumber}. Institution Bank Account #{labelNumber} {globalIdx === 0 ? '(Primary)' : ''}
                          </th>
                        );
                      })}
                      {isFirstChunk && (
                        <th className="p-2 text-left align-middle font-bold text-black">
                          {chunk.length + 1}. EMS Vendor Banking Information
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {hasFeeHead && (
                      <tr className="border-b border-black">
                        <td className="p-2 text-left align-middle bg-white font-semibold text-black">Fee Head Name</td>
                        {chunk.map((b, idx) => (
                          <td key={idx} className="p-2 text-left align-middle font-bold text-black">
                            {b.feeHeadName || '—'}
                          </td>
                        ))}
                        {isFirstChunk && <td className="p-2 text-left align-middle text-black">—</td>}
                      </tr>
                    )}
                    <tr className="border-b border-black">
                      <td className="p-2 text-left align-middle bg-white font-semibold text-black">Account Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 text-left align-middle font-bold text-black">
                          {b.accountName || '—'}
                        </td>
                      ))}
                      {isFirstChunk && <td className="p-2 text-left align-middle font-bold text-black">Edumate Technology</td>}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 text-left align-middle bg-white font-semibold text-black">Bank Name</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 text-left align-middle text-black">
                          {b.bankName || '—'}
                        </td>
                      ))}
                      {isFirstChunk && <td className="p-2 text-left align-middle font-medium text-black">United Commercial Bank PLC (UCB)</td>}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 text-left align-middle bg-white font-semibold text-black">Bank Address</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 text-left align-middle text-black">
                          {b.bankAddress || '—'}
                        </td>
                      ))}
                      {isFirstChunk && <td className="p-2 text-left align-middle text-black">Banasree, Dhaka</td>}
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 text-left align-middle bg-white font-semibold text-black">Account Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 text-left align-middle font-mono font-bold text-black">
                          {b.accountNumber || '—'}
                        </td>
                      ))}
                      {isFirstChunk && <td className="p-2 text-left align-middle font-mono font-bold text-black">1262112000001952</td>}
                    </tr>
                    <tr>
                      <td className="p-2 text-left align-middle bg-white font-semibold text-black">Routing Number</td>
                      {chunk.map((b, idx) => (
                        <td key={idx} className="p-2 text-left align-middle font-mono text-black">
                          {b.routingNumber || '—'}
                        </td>
                      ))}
                      {isFirstChunk && <td className="p-2 text-left align-middle font-mono text-black">245260726</td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          });
        })()}
      </div>

      {/* Settlement Point of Contact */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Settlement / Transaction Point of Contact's Information</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Mobile Number</td>
              <td className="p-2 text-black">{data.headMobile || '—'}</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">Email</td>
              <td className="p-2 text-black">{data.instituteEmail || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Enclosed Document Checklist */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Enclosed Document Checklist</h2>
        <div className="grid grid-cols-2 gap-2 border border-black p-3 bg-white text-[11px] text-black">
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked disabled /> Recent 1 copy of valid photograph of authorized personnel Lawfully representing the Merchant</div>
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked disabled /> Copy of EIIN certificate or institution’s approval from the education board</div>
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked disabled /> Copy of Bank Account cheque leaf of the institution</div>
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked disabled /> Copy of TIN and/or VAT certificates</div>
        </div>
      </div>

      {/* Website Information */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Website Information</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Web Address/URL</td>
              <td className="p-2 text-black font-mono font-medium">{data.websiteAddress || 'pay.academyims.com'}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Android Package ID</td>
              <td className="p-2 text-black">—</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">iOS App ID</td>
              <td className="p-2 text-black">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Transaction Profile */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Transaction Profile</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/2 p-2 bg-white font-semibold text-black">Projected Number of Transaction Per Month</td>
              <td className="p-2 font-mono text-black">1,000</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Projected Volume of Transaction Per Month</td>
              <td className="p-2 font-mono text-black">100,000,000 BDT</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Maximum Amount in A Single Transaction</td>
              <td className="p-2 font-mono text-black">50,000 BDT</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Maximum Number of Transaction Per Day</td>
              <td className="p-2 font-mono text-black">1,000</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">Maximum Volume of Transaction Per Day</td>
              <td className="p-2 font-mono text-black">10,000,000 BDT</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Classification Profile */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Classification Profile</h2>
        <table className="w-full border-collapse border border-black text-xs text-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-1/3 p-2 bg-white font-semibold text-black">Category</td>
              <td className="p-2 text-black">Education</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Tier</td>
              <td className="p-2 text-black">01</td>
            </tr>
            <tr className="border-b border-black">
              <td className="p-2 bg-white font-semibold text-black">Sector</td>
              <td className="p-2 text-black">University / College / School</td>
            </tr>
            <tr>
              <td className="p-2 bg-white font-semibold text-black">Segment/Product/Service to be Sold</td>
              <td className="p-2 text-black">Colleges, Universities, Professional Schools, and Junior Colleges</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* One Time Charge / Annual Recurring Charge */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">One Time Charge / Annual Recurring Charge (Non-Refundable)</h2>
        <div className="grid grid-cols-4 gap-2 border border-black p-3 bg-white text-[11px] text-black">
          <div className="flex items-center gap-1.5"><input type="checkbox" defaultChecked disabled /> Web API</div>
          <div className="flex items-center gap-1.5"><input type="checkbox" defaultChecked disabled /> Android/iOS SDK</div>
          <div className="flex items-center gap-1.5"><input type="checkbox" defaultChecked disabled /> Payment Link/QR</div>
          <div className="flex items-center gap-1.5"><input type="checkbox" defaultChecked disabled /> Plugins Install / Invoice Link</div>
        </div>
      </div>

      {/* Accepted Payment Channels & TDR */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Accepted Payment Channels & TDR</h2>
        <div className="grid grid-cols-4 gap-2 text-[10px] border border-black p-2 bg-white font-mono text-black">
          {['DC', 'AMEX', 'IBBL', 'IPAY', 'MTBL', 'UPAY', 'VISA', 'BKASH', 'MCASH', 'NAGAD', 'NEXUS', 'QCASH', 'TCASH', 'ROCKET', 'ABBANK', 'DMONEY', 'MASTER', 'MYCASH', 'TAPNPAY', 'UNIONPAY', 'BANKASIA', 'SURECASH', 'CITYTOUCH'].map((ch, idx) => (
            <div key={idx} className="flex justify-between p-1 bg-white border border-black rounded text-black">
              <span className="font-bold">{ch}</span>
              <span className="text-black font-bold">1.50%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Settlement */}
      <div className="mb-6">
        <h2 className="bg-white text-black font-bold px-3 py-1.5 text-xs mb-2 uppercase border border-black">Payment Settlement</h2>
        <div className="border border-black p-3 bg-white text-xs space-y-2 text-black">
          <div className="flex gap-4 font-semibold text-black">
            <span>[✓] Monday</span>
            <span>[✓] Tuesday</span>
            <span>[✓] Wednesday</span>
            <span>[✓] Thursday</span>
          </div>
          <p className="text-black text-[11px] italic">Minimum withdraw/Settlement amount is BDT 2,500.00</p>
        </div>
      </div>

      {/* MEF Enrolment Form Authorization & Declaration Signature Block */}
      <div className="my-6 p-4 border-2 border-black rounded bg-white text-black">
        <p className="font-bold text-xs uppercase mb-3 text-center pb-1 text-black">
          MERCHANT ENROLMENT FORM AUTHORIZATION & DECLARATION SIGNATURES
        </p>
        <div className="grid grid-cols-2 gap-8 text-xs pt-2 text-black">
          <div>
            <p className="font-bold text-black mb-1">ACCEPTED & SIGNED FOR MERCHANT:</p>
            <p className="font-semibold text-black">{data.instituteName || '—'}</p>
            <div className="mt-8 pt-2">
              <p className="font-bold text-black">Name: {data.headName || '—'}</p>
              <p className="text-black text-[11px]">Designation: {data.designation || '—'}</p>
              <p className="mt-2 text-[10px] text-black font-medium">[ Signature & Official Stamp ]</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-black mb-1">ACCEPTED & ENROLLED BY SSLCOMMERZ:</p>
            <p className="font-semibold text-black">Software Shop Limited (SSL)</p>
            <div className="mt-8 pt-2">
              <p className="font-bold text-black">Authorized Signatory</p>
              <p className="text-black text-[11px]">Date: {data.date || '08/08/2026'}</p>
              <p className="mt-2 text-[10px] text-black font-medium">[ Authorized Signature & Seal ]</p>
            </div>
          </div>
        </div>
      </div>

      {/* MERCHANT AGREEMENT Legal Terms - Full Verbatim Text */}
      <div className="mb-8 pt-6 page-break-before text-black">
        <div className="text-center mb-4 text-black">
          <h2 className="font-bold text-sm uppercase tracking-wide text-black">MERCHANT AGREEMENT</h2>
          <p className="text-[10px] text-black mt-1">
            This Agreement (“Agreement”) is a legally binding document between you (meaning the individual person or the Company or the Proprietor as the case may be) (hereinafter referred to as the “Merchant”) and Software Shop Limited (hereinafter referred to as “SSL”).
          </p>
        </div>

        <div className="space-y-4 text-[10px] text-justify leading-relaxed text-black font-sans">
          {/* RECITALS */}
          <div className="bg-white p-3 rounded border border-black text-black">
            <h3 className="font-bold text-xs uppercase mb-1 text-black">RECITALS</h3>
            <p className="mb-1 text-black">
              <strong>WHEREAS</strong>, This Agreement sets forth the terms and conditions under which SSL will provide Merchant with an Online Payment Gateway Software/System (hereinafter referred to as “SSLCOMMERZ”) as a Software as a Service (SaaS) modality and Merchant will acquire the SSLCOMMERZ System from SSL accordingly;
            </p>
            <p className="mb-1 text-black">
              <strong>AND WHEREAS</strong>, Merchant and SSL have agreed on the terms which shall govern the Payments payable to SSL as set forth in Merchant enrollment Form (hereinafter referred to as “MEF”) which is attached hereto and made a part hereof;
            </p>
            <p className="text-black">
              <strong>NOW, THEREFORE</strong>, in consideration of the mutual agreements and promises contained herein and for valuable consideration, the receipt and sufficiency which is hereby acknowledged, the Parties agree as follows:
            </p>
          </div>

          {/* 1. DEFINITIONS */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">1. DEFINITIONS</h3>
            <p className="mb-1 text-black">1. Wherever used in this Agreement the following terms shall have the meanings set forth below:</p>
            <div className="pl-3 space-y-1 text-black">
              <p><strong>“Agreement”</strong> means this Deed of Agreement including any amendments made from time to time.</p>
              <p><strong>“Authorization”</strong> means the authorization of a Transaction for Settlement in accordance with this agreement and subject to the Payment Card/Bank Account procedures.</p>
              <p><strong>“Authorization Request”</strong> means an electronic request for an Authorization for a Transaction generated at the Payment Gateway evidencing the payment of services by a Customer from the Merchant.</p>
              <p><strong>“Cardholder”</strong> means a person to whom a Payment Card is issued or is authorized to use such Payment Cards; it also means bank account holders that have a valid savings or current account with any of the partner banks of SSL.</p>
              <p><strong>“Credit Card Association”</strong> means Visa International, Inc., MasterCard International, Inc., and any other Credit or Debit card issuing company.</p>
              <p><strong>“Customer”</strong> means any person that purchases any of Merchant’s services, whose information Merchant will submit to SSL during the course of Merchant’s use of the SSL software/system.</p>
              <p><strong>“Customer Order/ Order”</strong> shall mean an order placed by a customer for payment for availing of services provided by Merchant at the website of Merchant.</p>
              <p><strong>“Effective Date”</strong> this Agreement is made effective as of the date (“Effective Date”) by clicking the “Agree”, or “Accept”, or signing or similar button/process for accepting this Agreement.</p>
              <p><strong>“Interface”</strong> means the Software interface, which will be provided by SSL to Merchant. The purpose of such interface is the linking of SSL’s service to Merchant’s Website in order to facilitate the process of Transactions.</p>
              <p><strong>“Payment Gateway Facilitators”</strong> shall mean and include the Acquiring Banks, MFS institutions, Facility Providers and associate Companies, as well as third party service providers and/or Payment Card industry issuers such as Master Card/ Visa/ American Express Card, various Banks, etc., and/or their service provider/agents.</p>
              <p><strong>“Invalid Transaction”</strong> means transaction shall not be valid if:</p>
              <ul className="list-disc pl-5 space-y-0.5 text-black">
                <li>the transaction and its records are illegal according to the Merchant type and transaction nature;</li>
                <li>the particulars inserted in the sales voucher are not identical with the particulars inserted in the copy given to the Cardholder/Customer;</li>
                <li>the Nominated Card is invalid at the time of transaction;</li>
                <li>the Merchant has failed to observe the Agreement in relation to the transaction;</li>
                <li>the Nominated Card was used without the authority of the Cardholder.</li>
              </ul>
              <p><strong>“Payment Card”</strong> means a Credit or Debit payment card, which SSL may process from time to time.</p>
              <p><strong>“SSL Site”</strong> shall mean the website with the domain name “www.sslcommerz.com” and all its sub domains established by SSL for the purposes of enabling payment processing instructions by the Customers of Merchant to SSL through the website of Merchant.</p>
              <p><strong>“The Bank”</strong> means Dutch Bangla Bank, BRAC Bank, Eastern Bank, City Bank, Southeast Bank, United Commercial Bank, Mutual Trust Bank or any other bank that provides transaction processing capacity and accepts payment from the customers as an acquiring bank.</p>
            </div>
            <p className="mt-1 text-black">2. Other capitalized expressions used in this Agreement shall have the meanings respectively assigned to them elsewhere in this Agreement.</p>
            <p className="text-black">3. Words indicating the singular only also include the plural and vice-versa, where the context so requires.</p>
            <p className="text-black">4. The headings of the Clauses in this Agreement are for convenience only and shall not affect the interpretation of this Agreement.</p>
          </div>

          {/* 2. SERVICE SCOPE */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">2. SERVICE SCOPE</h3>
            <p className="text-black">1. SSL shall develop and as a Software as a Service (SaaS), provide the Merchant with an Online Payment Gateway Software/System (brand name “SSLCOMMERZ”) and maintain such software/system so that Merchants can receive online payments from the Customers using customer’s available digital payment channel(s).</p>
            <p className="text-black">2. By acquiring SSLCOMMERZ system/solution, Customers of Merchant shall be able to send payments of products through internet to Merchant from Merchant’s website (e-commerce site or e-store). Customers shall be able to use their Bank/MFS/PSP Accounts or Credit/Debit Card to pay for products listed on Merchant’s Website.</p>
            <p className="text-black">3. SSLCOMMERZ Software/System shall enable:</p>
            <div className="pl-4 space-y-0.5 text-black">
              <p>a) The Merchant shall accept all major Credit Cards, signature Debit Cards, mobile banking, internet banking and wallet provided by the concerned issuing banks, MFS, PSP and other digital payment instrument providers.</p>
              <p>b) The Customer shall use full featured Merchant Interface to monitor and control payments through Merchant’s website.</p>
              <p>c) Customers’ funds to be automatically deposited into Merchant’s Bank Account within mentioned timeline in MEF.</p>
            </div>
            <p className="text-black">4. The Merchant agrees that SSL, in providing the SSLCOMMERZ software/system, acts solely as a facilitator on behalf of the Merchant to enable the Merchant to conduct Transactions with its Customers. SSL does not act as a principal or assume liability for the performance, non-performance, or fulfillment of any Transaction. The Merchant expressly waives any claims against SSL arising from the performance, non-performance, or any consequences of Transactions executed as a result of SSL’s acceptance of an Authorization.</p>
            <p className="text-black">5. The Merchant acknowledges that, SSL shall have the right to update the terms of this Agreement and policies as deem necessary.</p>
          </div>

          {/* 3. MERCHANT OBLIGATIONS */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">3. MERCHANT OBLIGATIONS</h3>
            <p className="text-black">1. The Merchant agrees and undertakes to:</p>
            <div className="pl-4 space-y-0.5 text-black">
              <p>a) Provide SSL with accurate and authentic information regarding the Merchant’s designated bank account, product/service-related information, all transaction related information and supporting documents;</p>
              <p>b) Pay any and all Fees in accordance with payment terms mentioned in MEF;</p>
              <p>c) Not to use the SSLCOMMERZ software/system in any manner whatsoever which may constitute a violation of any law or regulation or which may cause SSL to be subject to legal action;</p>
              <p>d) Describe accurately on the Merchant’s website the procedure for entering into a Transaction;</p>
              <p>e) Not store Payment Card details or Bank Account details on any server without undergoing an approved Third Party security audit;</p>
              <p>f) Establish an online website protected by Secure Socket Layer and provide mandatory Customer registration;</p>
              <p>g) Support and provide necessary assistance to SSL regarding Merchant due diligence and periodic risk assessment.</p>
            </div>
            <p className="text-black">2. The Merchant agrees to ensure its mandatory registration with SSLCOMMERZ software/system and respective Payment Processor.</p>
            <p className="text-black">3. Merchant must select an ID and password to enable access. The Merchant is solely responsible for maintaining security of all IDs, passwords, or codes.</p>
            <p className="text-black">4. Merchant is solely responsible for the security of data residing on servers owned or operated by Merchant.</p>
            <p className="text-black">5. The Merchant must display nominated card insignia, provide logs/data for fraud disputes, deliver sales draft copies, enable printing transaction vouchers, and ensure website contains complete product descriptions, return/refund policy, customer contact info, delivery policy, nominated logos, SSLCOMMERZ Verified seal, BDT currency, and Bangladesh domicile.</p>
            <p className="text-black">6. The Merchant must not submit previously charged-back transactions, nor store or disseminate cardholder info.</p>
            <p className="text-black">7. Remittance/currency exchange for foreign origin products must be through approved Bangladesh Bank channels.</p>
            <p className="text-black">8. Merchant website and systems must comply with data protection laws.</p>
            <p className="text-black">9. Merchant warrants goods/services are merchantable, free from defects, and assumes full responsibility for resolving customer complaints.</p>
            <p className="text-black">10. Merchant is solely responsible for addressing customer complaints, refunds, and cancellations.</p>
            <p className="text-black">11. Merchant warrants virtual content is free from defects and does not infringe third-party IP rights.</p>
            <p className="text-black">12. Merchant agrees to provide clear voucher redemption processes in compliance with regulations.</p>
            <p className="text-black">13. Any fines or penalties levied by Payment Gateway Facilitators/Card Associations pertaining to breach shall be recovered from Merchant.</p>
            <p className="text-black">14. Merchant shall indemnify SSL and Payment Gateway Facilitators against claims arising from disputes with Customers.</p>
            <p className="text-black">15. Merchant shall maintain confidentiality of all customer and system information.</p>
            <p className="text-black">16. Merchant grants SSL a non-exclusive, royalty-free limited license to display Merchant trademarks/logos.</p>
            <p className="text-black">17. SSL grants Merchant a non-exclusive, royalty-free limited license to display SSL Trademarks on Merchant site.</p>
          </div>

          {/* 4. PAYMENT TO THE MERCHANT */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">4. PAYMENT TO THE MERCHANT</h3>
            <p className="text-black">1. Net payments shall be made available by SSL to the Merchant after adjustments for fees/TDR, chargebacks, and overpayments.</p>
            <p className="text-black">2. <strong>TIME OF MAKING PAYMENTS/ DUE DATE OF PAYMENT:</strong> Payments will be delivered to Merchant as set out in MEF, subject to resolving inquiries, disputes, and chargebacks.</p>
            <p className="text-black">3. Payment release is governed by prevailing laws and escrow payment modalities where applicable.</p>
            <p className="text-black">4. <strong>REJECTION OF PAYMENT FOR INVALID TRANSACTIONS:</strong> SSL may refuse total or partial payment or debit Merchant account for unlawful transactions, mismatched vouchers, unauthorized usage, invalid currencies, unfulfilled goods, disputed charges, or missing proof of delivery.</p>
            <p className="text-black">5. SSL reserves the right to suspend payments if negligence, breach, or fraud is suspected until enquiries are resolved.</p>
          </div>

          {/* 5. CHARGEBACK */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">5. CHARGEBACK</h3>
            <p className="text-black">1. For Invalid Transactions, SSL may refuse the transaction or charge back to Merchant within two years by debiting Merchant Account.</p>
            <p className="text-black">2. Merchant must verify shipping address before delivery. Merchant shall be fully liable for chargebacks if proper delivery documents & invoice are not submitted.</p>
          </div>

          {/* Page Signature Bar 1 */}
          <div className="my-4 pt-2 pb-2 bg-white px-3 rounded text-[10px] flex justify-between items-center text-black border border-black">
            <div>
              <span className="font-bold text-black">Merchant Signature & Stamp:</span> ______________________
            </div>
            <div>
              <span className="font-bold text-black">SSLCOMMERZ Signature:</span> ______________________
            </div>
            <span className="text-[9px] text-black italic">[ Page Initial / Seal ]</span>
          </div>

          {/* 6. AUTHORIZATION */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">6. AUTHORIZATION</h3>
            <p className="text-black">1. Merchant shall obtain Authorization from SSL before accepting Orders.</p>
            <p className="text-black">2. Unacceptable Transactions: Merchant shall not process transactions for other establishments or give cash advances.</p>
          </div>

          {/* 7. TRANSACTION HANDLING */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">7. TRANSACTION HANDLING</h3>
            <p className="text-black">1. SSL will not entertain invalid transactions.</p>
            <p className="text-black">2. Merchant shall deliver an invoice to Cardholder including charges and terms.</p>
            <p className="text-black">3. Inability to comply with an order requires immediate cancellation.</p>
          </div>

          {/* 8. DISPUTES REGARDING PRODUCTS/SERVICES */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">8. DISPUTES REGARDING PRODUCTS/SERVICES</h3>
            <p className="text-black">1. SSL and Payment Gateway Facilitators are not responsible for product quality, merchantability, or non-delivery. All risks belong to Merchant.</p>
            <p className="text-black">2. Email invoices generated for successful transactions may be used for dispute resolution.</p>
          </div>

          {/* 9. REFUNDS / REFUND POLICY TO CUSTOMERS */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">9. REFUNDS / REFUND POLICY TO CUSTOMERS</h3>
            <p className="text-black">1. Merchant shall initiate valid credit slips or web panel refund requests within 07 working days of agreement with Customer.</p>
            <p className="text-black">2. SSL shall convey refund requests to Banks/facilitators within 07 working days and debit Merchant account accordingly.</p>
            <p className="text-black">3. Refund charges and TDR reversals apply as per payment channel policies and Bangladesh Bank guidelines.</p>
          </div>

          {/* 10. AML & CFT COMPLIANCE */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">10. AML & CFT COMPLIANCE</h3>
            <p className="text-black">The Merchant shall comply with all AML & CFT regulations and guidelines of Bangladesh Bank while operating under this agreement.</p>
          </div>

          {/* 11. AUDIT */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">11. AUDIT</h3>
            <p className="text-black">In case of dispute or suspected fraud, SSL or its agents may enter Merchant premises during business hours to audit records.</p>
          </div>

          {/* 12. TERM AND TERMINATION */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">12. TERM AND TERMINATION</h3>
            <p className="text-black">1. Agreement commences on signing date for initial period of 3 years, automatically renewed yearly unless terminated with 90 days written notice.</p>
            <p className="text-black">2. SSL may terminate immediately for insolvency, material breach, 6 months inactivity, high chargebacks, fraud, or reputational damage.</p>
            <p className="text-black">3. Surfacing obligations and pending settlements survive termination.</p>
          </div>

          {/* Page Signature Bar 2 */}
          <div className="my-4 pt-2 pb-2 bg-white px-3 rounded text-[10px] flex justify-between items-center text-black border border-black">
            <div>
              <span className="font-bold text-black">Merchant Signature & Stamp:</span> ______________________
            </div>
            <div>
              <span className="font-bold text-black">SSLCOMMERZ Signature:</span> ______________________
            </div>
            <span className="text-[9px] text-black italic">[ Page Initial / Seal ]</span>
          </div>

          {/* 13. CUSTOMER CHARGE/PRICE */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">13. CUSTOMER CHARGE/PRICE</h3>
            <p className="text-black">Merchant agrees to transparent pricing without hidden fees, inclusive of taxes and uniform to all Cardholders.</p>
          </div>

          {/* 14. ARBITRATION AND GOVERNANCE */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">14. ARBITRATION AND GOVERNANCE</h3>
            <p className="text-black">Governed by Bangladesh law. Unresolved disputes after 30 days shall be referred to arbitration in Dhaka under Arbitration Act 2001.</p>
          </div>

          {/* 15. AMENDMENT */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">15. AMENDMENT</h3>
            <p className="text-black">Modified only upon mutual written agreement and quarterly review discussions.</p>
          </div>

          {/* 16. LIMITATIONS OF LIABILITY */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">16. LIMITATIONS OF LIABILITY</h3>
            <p className="text-black">Neither party is liable for lost revenue or indirect damages. SSL's aggregate liability is capped at total fees paid in the prior 3 months.</p>
          </div>

          {/* 17. CONFIDENTIALITY */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">17. CONFIDENTIALITY</h3>
            <p className="text-black">Merchant shall treat all tangible and intangible business details and trade secrets as strictly confidential.</p>
          </div>

          {/* 18. INTELLECTUAL PROPERTY RIGHTS (IPR) */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">18. INTELLECTUAL PROPERTY RIGHTS (IPR)</h3>
            <p className="text-black">SSLCOMMERZ is provided as SaaS. All IPR related to software/system remains exclusively with SSL.</p>
          </div>

          {/* 19. FORCE MAJEURE */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">19. FORCE MAJEURE</h3>
            <p className="text-black">Exempts performance failures caused by events beyond reasonable control (acts of God, strikes, network breakdowns).</p>
          </div>

          {/* 20. INDEMNITY */}
          <div>
            <h3 className="font-bold text-xs uppercase border-b border-black pb-0.5 mb-1.5 text-black">20. INDEMNITY</h3>
            <p className="text-black">Each party indemnifies the other from losses arising out of non-compliance or defaulting actions.</p>
          </div>

          {/* Page Signature Bar 3 */}
          <div className="my-4 pt-2 pb-2 bg-white px-3 rounded text-[10px] flex justify-between items-center text-black border border-black">
            <div>
              <span className="font-bold text-black">Merchant Signature & Stamp:</span> ______________________
            </div>
            <div>
              <span className="font-bold text-black">SSLCOMMERZ Signature:</span> ______________________
            </div>
            <span className="text-[9px] text-black italic">[ Page Initial / Seal ]</span>
          </div>

          {/* 21. WEBSITE REQUIREMENTS */}
          <div>
            <h3 className="font-bold text-xs uppercase pb-0.5 mb-1.5 text-black">21. WEBSITE REQUIREMENTS</h3>
            <p className="text-black">Merchant website must have an easy-to-remember domain, TLS 1.2+ secure hosting, customer registration page, electronic invoice email order confirmations, clear data privacy & return policies, SSL certificate (https), responsive design, user-friendly navigation, compressed images, shopping cart, FAQs, and social media integration.</p>
          </div>

          {/* 22. FORBIDDEN BUSINESS */}
          <div>
            <h3 className="font-bold text-xs uppercase pb-0.5 mb-1.5 text-black">22. FORBIDDEN BUSINESS</h3>
            <p className="text-black">Forbidden: Adult goods/services, escort services, alcohol, human body parts, child pornography, copyrighted media/software, gambling, hacking guides, illegal/offensive goods, prescription drugs, weapons, live animals, digital diamonds/coins, or non-compliant services.</p>
          </div>

          {/* 23. ENTIRE AGREEMENT */}
          <div>
            <h3 className="font-bold text-xs uppercase pb-0.5 mb-1.5 text-black">23. ENTIRE AGREEMENT</h3>
            <p className="text-black">Supersedes all prior understandings or verbal consents between the Parties.</p>
            <p className="font-bold italic mt-2 text-black">IN WITNESS WHEREOF, the Parties hereto have executed this agreement & affixed their hands seals effective as of the date first above written.</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="pt-6 mt-8 space-y-6 text-black">
        <div className="grid grid-cols-2 gap-8 text-xs text-black">
          <div>
            <p className="font-bold mb-1 text-black">ACCEPTED & SIGNED FOR ON BEHALF OF:</p>
            <p className="font-semibold text-black">SOFTWARE SHOP LIMITED</p>
            <p className="text-[11px] text-black">Address: 93B, New Eskaton Road, Dhaka 1000, Bangladesh.</p>
            <p className="mt-2 text-[11px] text-black">Date: {data.date || '08/08/2026'}</p>
            <div className="mt-8 pt-2">
              <p className="font-bold text-black">Md Sagir Ahmed</p>
              <p className="text-black text-[11px]">Head of Ecommerce</p>
            </div>
            <div className="mt-4 pt-2">
              <p className="font-bold text-black">Ahmed Reza</p>
              <p className="text-black text-[11px]">Sales Representative</p>
            </div>
          </div>

          <div>
            <p className="font-bold mb-1 text-black">ACCEPTED & SIGNED FOR ON BEHALF OF MERCHANT:</p>
            <p className="font-semibold text-black">Institute: {data.instituteName || '—'}</p>
            <p className="text-[11px] text-black">Address: {data.instituteAddress || '—'}</p>
            <p className="mt-2 text-[11px] text-black">Date: {data.date || '08/08/2026'}</p>
            <div className="mt-8 pt-2">
              <p className="font-bold text-black">Name: {data.headName || '—'}</p>
              <p className="text-black text-[11px]">Designation: {data.designation || '—'}</p>
              <p className="mt-4 text-[11px] text-black">Merchant Signature & Stamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
