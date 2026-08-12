import React, { useState } from 'react';
import { Search, PhoneCall, Loader2, FileCheck2, AlertCircle, RefreshCw } from 'lucide-react';
import { InstituteAgreementData } from '../types';

interface Props {
  onSearchResult: (agreements: InstituteAgreementData[]) => void;
  onClearSearch: () => void;
}

export const SearchBar: React.FC<Props> = ({ onSearchResult, onClearSearch }) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const banglaToEnglishDigits = (str: string) => {
    if (typeof str !== 'string') return str;
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let res = str;
    for (let i = 0; i < 10; i++) {
      res = res.replace(new RegExp(banglaDigits[i], 'g'), i.toString());
    }
    return res;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setError('Please enter a mobile number.');
      return;
    }

    let cleanMobile = banglaToEnglishDigits(mobile.trim());
    cleanMobile = cleanMobile.replace(/[\u0980-\u09FF]/g, '');

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/agreements/search?mobile=${encodeURIComponent(cleanMobile)}`);
      const json = await res.json();

      if (res.ok && json.success) {
        onSearchResult(json.data || []);
        if (!json.data || json.data.length === 0) {
          setError('No submitted agreement information found for this mobile number.');
        }
      } else {
        setError(json.error || 'Error searching agreement information.');
      }
    } catch (err: any) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMobile('');
    setError(null);
    setSearched(false);
    onClearSearch();
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Search & Update Details by Mobile Number</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          View Your Previously Submitted Agreement Information
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Search using the Institute Head's mobile number provided during application to view submitted details, update information if required, and download auto-generated PDF files.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="pt-2 max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 shadow-lg">
            <div className="relative flex-1">
              <input
                type="text"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter Institute Head's Mobile Number..."
                className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>

              {searched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-3 rounded-xl transition-colors flex items-center gap-1"
                  title="Reset"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center justify-center gap-2 max-w-lg mx-auto animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
