import React, { useState } from 'react';
import { Building2, Search, PlusCircle, FileText, Phone, ShieldCheck } from 'lucide-react';

interface Props {
  onSearch: (mobile: string) => void;
  onNewAgreement: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<Props> = ({ onSearch, onNewAgreement, onOpenHelp }) => {
  const [mobileQuery, setMobileQuery] = useState('');

  const banglaToEnglishDigits = (str: string) => {
    if (typeof str !== 'string') return str;
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let res = str;
    for (let i = 0; i < 10; i++) {
      res = res.replace(new RegExp(banglaDigits[i], 'g'), i.toString());
    }
    return res;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileQuery.trim()) {
      let clean = banglaToEnglishDigits(mobileQuery.trim());
      clean = clean.replace(/[\u0980-\u09FF]/g, '');
      onSearch(clean);
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={onNewAgreement}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Automate IT Limited
              </span>
              <span className="bg-blue-600/30 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                Agreement Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Educational Institution Service Agreement & Digital Document Panel
            </p>
          </div>
        </div>

        {/* Quick Search on Header */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              placeholder="Search by mobile number (e.g. 01712345678)..."
              className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-24 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewAgreement}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Form</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Instructions</span>
          </button>
        </div>
      </div>
    </header>
  );
};
