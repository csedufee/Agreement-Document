import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Agreement Form Filling Instructions</h3>
              <p className="text-xs text-slate-400">Automate IT Limited - Educational Institution Service Agreement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Important Notice:</p>
              <p className="text-amber-800 mt-0.5">
                The Institute Head's Name and Date of Birth must strictly match the National ID (NID) card. Otherwise, activation of banking and bKash payment gateways may be delayed.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <h4 className="font-bold text-slate-900 text-sm">Generated Official Documents:</h4>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Academy Service Agreement (Agreement):</strong> Agreement tenure is calculated as 1 year (e.g. 08/08/2026 to 07/08/2027).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>MEF Form:</strong> Preserves SSLCOMMERZ Merchant Enrolment Format.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Authorization Letter, Web Portal, PayBill, Dynamic Charging, Board Resolution, Declaration:</strong> All documents are formatted for A4 print with top pad space reserved for institute letterhead.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl">
            <p className="font-bold text-blue-900 mb-1">Module & Service Charge Rules:</p>
            <p className="text-blue-800">
              11 basic modules are included completely free (including Human Resource). Among 8 optional modules, the first module fee is ৳40 and each additional module adds ৳15 service charge.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
