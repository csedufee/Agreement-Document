import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, FileText, ArrowRight, RefreshCw, Sparkles, Building, Edit3 } from 'lucide-react';
import { InstituteAgreementData } from '../types';
import { DocumentViewer } from './DocumentViewer';

interface Props {
  data: InstituteAgreementData;
  onNewForm: () => void;
  onUpdateInfo: () => void;
}

export const SuccessView: React.FC<Props> = ({ data, onNewForm, onUpdateInfo }) => {
  const [viewMode, setViewMode] = useState<'success' | 'preview'>('success');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {viewMode === 'success' ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Information Saved Successfully on Server</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {data.instituteName} - Agreement Process Completed!
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Based on your provided information, 8 official documents (Agreement, MEF Form, Authorization Letter, Web Portal, PayBill, Dynamic Charging, Board Resolution, Declaration) have been generated.
            </p>
          </div>

          {/* Quick Details Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto text-left text-xs space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div><span className="text-slate-500 font-medium">Institute Head:</span> <strong className="text-slate-900">{data.headName}</strong></div>
              <div><span className="text-slate-500 font-medium">Mobile Number:</span> <strong className="text-slate-900 font-mono">{data.headMobile}</strong></div>
              <div><span className="text-slate-500 font-medium">Agreement Date:</span> <strong className="text-slate-900 font-mono">{data.date}</strong></div>
              <div><span className="text-slate-500 font-medium">Agreement Tenure:</span> <strong className="text-slate-900 font-mono">{data.expiryDate || '07/08/2027'}</strong></div>
              <div><span className="text-slate-500 font-medium">Calculated Service Charge:</span> <strong className="text-emerald-700 font-bold font-mono">৳{data.calculatedServiceCharge}</strong></div>
              <div><span className="text-slate-500 font-medium">Website:</span> <strong className="text-blue-700 font-mono">{data.websiteAddress}</strong></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setViewMode('preview')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Preview & Download All Documents</span>
            </button>

            <button
              onClick={onUpdateInfo}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Information / তথ্য আপডেট করুন</span>
            </button>

            <button
              onClick={onNewForm}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-6 py-3.5 rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Building className="w-4 h-4 text-slate-600" />
              <span>Fill New Agreement Form</span>
            </button>
          </div>
        </div>
      ) : (
        <DocumentViewer data={data} onBackToEdit={() => setViewMode('success')} />
      )}
    </div>
  );
};
