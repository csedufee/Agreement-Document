import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { AgreementForm } from './components/AgreementForm';
import { SuccessView } from './components/SuccessView';
import { DocumentViewer } from './components/DocumentViewer';
import { HelpModal } from './components/HelpModal';
import { InstituteAgreementData } from './types';
import { formatServiceChargeSummary } from './data/modules';
import { Building2, Phone, PhoneCall, MessageCircle, Mail, MapPin, Eye, Edit3, Download, PlusCircle, CheckCircle2, Search } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'searchResults' | 'success' | 'preview'>('form');
  const [activeAgreement, setActiveAgreement] = useState<InstituteAgreementData | null>(null);
  const [searchResults, setSearchResults] = useState<InstituteAgreementData[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Search Results Handler
  const handleSearchResults = (results: InstituteAgreementData[]) => {
    setSearchResults(results);
    if (results.length === 1) {
      setActiveAgreement(results[0]);
      setCurrentView('success');
    } else if (results.length > 1) {
      setCurrentView('searchResults');
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
  };

  // Submit Success Handler
  const handleSubmitSuccess = (savedData: InstituteAgreementData) => {
    setActiveAgreement(savedData);
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New Agreement Form Handler
  const handleNewAgreement = () => {
    setActiveAgreement(null);
    setSearchResults([]);
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update Existing Agreement Form Handler
  const handleUpdateInfo = () => {
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Search Item for Edit or Preview
  const handleSelectSearchItem = (item: InstituteAgreementData, mode: 'edit' | 'preview') => {
    setActiveAgreement(item);
    if (mode === 'edit') {
      setCurrentView('form');
    } else {
      setCurrentView('preview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Header Navbar */}
      <Navbar
        onSearch={(mobile) => {
          fetch(`/api/agreements/search?mobile=${encodeURIComponent(mobile)}`)
            .then(res => res.json())
            .then(json => {
              if (json.success && json.data) {
                handleSearchResults(json.data);
              }
            });
        }}
        onNewAgreement={handleNewAgreement}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Persistent Search Bar Banner on Top of Home/Form View */}
        {currentView === 'form' && (
          <SearchBar
            onSearchResult={handleSearchResults}
            onClearSearch={handleClearSearch}
          />
        )}

        {/* View Switcher */}
        {currentView === 'searchResults' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>Search Results ({searchResults.length} found)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your institution from the list below to preview documents or update details.
                </p>
              </div>

              <button
                onClick={handleNewAgreement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Form</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.instituteName}</h3>
                      <p className="text-xs text-slate-500">{item.instituteAddress}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {item.id}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 font-sans border-t border-slate-200/80 pt-3">
                    <p><strong>Headmaster/Principal:</strong> {item.headName}</p>
                    <p><strong>Mobile:</strong> <span className="font-mono">{item.headMobile}</span></p>
                    <p><strong>Date:</strong> <span className="font-mono">{item.date}</span></p>
                    <p><strong>Service Charge:</strong> <span className="text-emerald-700 font-bold font-mono">{formatServiceChargeSummary(item)}</span></p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSelectSearchItem(item, 'preview')}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Documents</span>
                    </button>

                    <button
                      onClick={() => handleSelectSearchItem(item, 'edit')}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update Info</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'form' && (
          <AgreementForm
            initialData={activeAgreement}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}

        {currentView === 'success' && activeAgreement && (
          <SuccessView
            data={activeAgreement}
            onNewForm={handleNewAgreement}
            onUpdateInfo={handleUpdateInfo}
          />
        )}

        {currentView === 'preview' && activeAgreement && (
          <DocumentViewer
            data={activeAgreement}
            onBackToEdit={() => setCurrentView('form')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12 py-10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span>Automate IT Limited</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Educational Institution Automation, Digital Payment Gateway Solutions, and EMS Software Automation Portal.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              © {new Date().getFullYear()} Automate IT Limited. All rights reserved.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contact Address</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>House- 34/A, Road- 13/2, Block- K, South Banasree, Dhaka-1219</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Call: <span className="font-mono text-slate-200">09613241234</span></span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span>WhatsApp: <span className="font-mono text-slate-200">01335127799</span></span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Email: <span className="text-slate-200">cs.edufee@gmail.com</span></span>
            </p>
          </div>
        </div>
      </footer>

      {/* Instructions Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
