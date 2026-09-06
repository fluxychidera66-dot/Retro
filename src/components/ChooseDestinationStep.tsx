import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Folder, 
  Search, 
  X, 
  Sparkles,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { GoogleSheetsLogo, GoogleLogo, Inbox2DataBrand } from './Logos';
import { DRIVE_SHEETS, DriveSheet } from './OnboardingFlow';

export interface DestinationConfig {
  type: 'new' | 'existing';
  sheetName: string;
  tabName: string;
}

interface ChooseDestinationStepProps {
  promptText: string;
  userEmail: string;
  initialConfig?: DestinationConfig;
  onContinue: (config: DestinationConfig) => void;
  onBack: () => void;
}

export function ChooseDestinationStep({
  promptText,
  userEmail,
  initialConfig,
  onContinue,
  onBack
}: ChooseDestinationStepProps) {
  // Infer smart default sheet name based on prompt
  const isInvoice = promptText.toLowerCase().includes('invoice') || 
                    promptText.toLowerCase().includes('receipt') || 
                    promptText.toLowerCase().includes('vendor') ||
                    promptText.toLowerCase().includes('billing');
  
  const defaultNewSheetName = isInvoice 
    ? "SaaS & Vendor Invoices Sync — Sheetflow" 
    : "inbox2data — Extracted Records";

  const [destType, setDestType] = useState<'new' | 'existing'>(
    initialConfig?.type || 'new'
  );
  const [newSheetName, setNewSheetName] = useState<string>(
    initialConfig?.type === 'new' ? initialConfig.sheetName : defaultNewSheetName
  );

  // Existing sheet picker state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedSheet, setSelectedSheet] = useState<DriveSheet>(DRIVE_SHEETS[0]);
  const [selectedTab, setSelectedTab] = useState<string>(
    initialConfig?.tabName || 'Sheet1'
  );

  const filteredDriveSheets = DRIVE_SHEETS.filter(sheet => 
    sheet.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    sheet.owner.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destType === 'new') {
      onContinue({
        type: 'new',
        sheetName: newSheetName.trim() || defaultNewSheetName,
        tabName: 'Sheet1'
      });
    } else {
      onContinue({
        type: 'existing',
        sheetName: selectedSheet.name,
        tabName: selectedTab
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-medium text-[#5b6882] hover:text-[#000000] py-1.5 px-3 rounded-full hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Prompt</span>
            </button>
            <div className="h-4 w-px bg-[#e5e7eb]" />
            <Inbox2DataBrand size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#5b6882] bg-[#f9fafb] px-3 py-1.5 rounded-full border border-[#e5e7eb]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[#000000] truncate max-w-[160px]">{userEmail}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="surf-btn px-5 py-2 rounded-full text-xs font-medium tracking-tight flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Columns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {/* Title Area */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#006dc8] bg-[#cfe9fd]/40 border border-[#cfe9fd] mx-auto">
            <GoogleSheetsLogo className="w-3.5 h-3.5" />
            <span>Step 2 of 4 • Destination Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#000000] tracking-tight">
            Choose where extracted data goes
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6882] max-w-md mx-auto">
            Select how you'd like your incoming emails from Gmail to be recorded into Google Sheets.
          </p>
        </div>

        {/* Form Selection Cards */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Create a new sheet */}
          <div
            onClick={() => setDestType('new')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white ${
              destType === 'new'
                ? 'border-[#009afc] ring-2 ring-[#009afc]/20 shadow-sm'
                : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
            }`}
            style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 2px 4px 0px" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <GoogleSheetsLogo className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-[#000000]">
                      Create a new sheet
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Instant & Automatic
                    </span>
                  </div>
                  <p className="text-xs text-[#5b6882] leading-relaxed max-w-lg">
                    No file picker needed. The app will auto-create a new Google Sheet named after your automation in your Google Drive.
                  </p>
                </div>
              </div>

              <div className="shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  destType === 'new'
                    ? 'border-[#009afc] bg-[#009afc] text-white'
                    : 'border-[#d1d1d1]'
                }`}>
                  {destType === 'new' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Input field for new sheet name */}
            {destType === 'new' && (
              <div className="mt-5 pt-4 border-t border-[#f3f4f6] space-y-2">
                <label className="block text-[11px] font-semibold text-[#5b6882] uppercase tracking-wider">
                  NEW SPREADSHEET NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    placeholder="e.g. SaaS & Vendor Invoices Sync — Sheetflow"
                    className="w-full px-3.5 py-2.5 bg-[#f9fafb] text-xs sm:text-sm font-medium text-[#000000] border border-[#e5e7eb] rounded-xl focus:outline-hidden focus:border-[#009afc] focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#808080]">
                  Pre-formatted with styled headers, frozen top row, and clean gridlines.
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Use an existing sheet */}
          <div
            onClick={() => setDestType('existing')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white ${
              destType === 'existing'
                ? 'border-[#009afc] ring-2 ring-[#009afc]/20 shadow-sm'
                : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
            }`}
            style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 2px 4px 0px" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#cfe9fd]/40 border border-[#cfe9fd] flex items-center justify-center shrink-0 text-[#006dc8]">
                  <Folder className="w-5 h-5 text-[#006dc8]" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-[#000000]">
                      Use an existing sheet
                    </h3>
                    <span className="text-[10px] font-semibold text-[#006dc8] bg-[#cfe9fd]/50 px-2 py-0.5 rounded-full border border-[#cfe9fd]">
                      Google Picker
                    </span>
                  </div>
                  <p className="text-xs text-[#5b6882] leading-relaxed max-w-lg">
                    Opens the Google Picker widget (Google's native file browser for Drive) to select a spreadsheet you already own and pick a tab.
                  </p>
                </div>
              </div>

              <div className="shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  destType === 'existing'
                    ? 'border-[#009afc] bg-[#009afc] text-white'
                    : 'border-[#d1d1d1]'
                }`}>
                  {destType === 'existing' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Existing sheet selection details */}
            {destType === 'existing' && (
              <div className="mt-5 pt-4 border-t border-[#f3f4f6] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Spreadsheet Picker Button */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5b6882] uppercase tracking-wider mb-1.5">
                      SELECTED SPREADSHEET
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="w-full px-3.5 py-2.5 bg-[#f9fafb] hover:bg-white border border-[#e5e7eb] hover:border-[#009afc] rounded-xl flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <GoogleSheetsLogo className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold text-[#000000] truncate">
                          {selectedSheet.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#006dc8] shrink-0 ml-2">
                        Change
                      </span>
                    </button>
                  </div>

                  {/* Target Tab Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5b6882] uppercase tracking-wider mb-1.5">
                      TARGET TAB / WORKSHEET
                    </label>
                    <select
                      value={selectedTab}
                      onChange={(e) => setSelectedTab(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-xs font-semibold text-[#000000] focus:outline-hidden focus:border-[#009afc] cursor-pointer"
                    >
                      {selectedSheet.tabs.map(tab => (
                        <option key={tab} value={tab}>{tab}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5b6882] bg-[#f9fafb] p-2.5 rounded-xl border border-[#e5e7eb]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    New rows will be appended to the bottom of <strong>{selectedSheet.name}</strong> under tab <strong>{selectedTab}</strong>.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-medium text-[#5b6882] hover:text-[#000000] transition-colors cursor-pointer"
            >
              ← Back to prompt
            </button>

            <button
              type="submit"
              className="surf-btn px-7 py-3 rounded-full text-xs font-medium tracking-tight flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Continue to Column Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </main>

      {/* Google Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#e5e7eb] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
              <div className="flex items-center gap-2">
                <GoogleSheetsLogo className="w-5 h-5" />
                <span className="text-sm font-semibold text-[#000000]">Select Google Sheet from Drive</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="text-[#5b6882] hover:text-[#000000] p-1 rounded-lg hover:bg-[#e5e7eb] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-[#e5e7eb]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#808080] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search spreadsheets in Google Drive..."
                  className="w-full pl-9 pr-4 py-2 bg-[#f9fafb] text-xs font-medium text-[#000000] border border-[#e5e7eb] rounded-xl focus:outline-hidden focus:border-[#009afc] focus:bg-white transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#f3f4f6]">
              {filteredDriveSheets.map(sheet => {
                const isSelected = selectedSheet.id === sheet.id;
                return (
                  <div
                    key={sheet.id}
                    onClick={() => {
                      setSelectedSheet(sheet);
                      setSelectedTab(sheet.tabs[0] || 'Sheet1');
                      setIsPickerOpen(false);
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#cfe9fd]/30 border border-[#cfe9fd]' : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GoogleSheetsLogo className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#000000] truncate">{sheet.name}</div>
                        <div className="text-[11px] text-[#5b6882]">Modified {sheet.lastModified} • {sheet.tabs.length} tabs</div>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-xs font-medium text-[#006dc8] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <button 
                        type="button"
                        className="text-xs font-medium text-[#5b6882] px-2.5 py-1 rounded-lg border border-[#e5e7eb]"
                      >
                        Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between text-xs text-[#5b6882]">
              <div className="flex items-center gap-1.5">
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Drive File Picker</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#e5e7eb] bg-white text-xs font-medium text-[#000000] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
