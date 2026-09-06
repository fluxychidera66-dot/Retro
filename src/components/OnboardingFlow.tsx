import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  Check, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  FileText,
  Sparkles
} from 'lucide-react';
import { GoogleSheetsLogo, GoogleLogo, Inbox2DataBrand } from './Logos';
import { UserAccount } from '../types';

export interface DriveSheet {
  id: string;
  name: string;
  lastModified: string;
  owner: string;
  tabs: string[];
  tabColumns: Record<string, string[]>;
}

export const DRIVE_SHEETS: DriveSheet[] = [
  {
    id: 'sheet-1',
    name: 'AP & Expense Ledger 2026',
    lastModified: 'Sep 04, 2026',
    owner: 'Me',
    tabs: ['Sheet1', 'Invoices & Receipts', 'Q3 Expenses', 'Vendor Ledger'],
    tabColumns: {
      'Sheet1': ['Date', 'Vendor', 'Invoice #', 'Amount Due', 'Payment Status'],
      'Invoices & Receipts': ['Invoice Date', 'Vendor Name', 'Invoice Number', 'Gross Total', 'Due Date', 'Notes'],
      'Q3 Expenses': ['Date', 'Merchant', 'Category', 'Amount', 'Receipt URL'],
      'Vendor Ledger': ['Vendor ID', 'Company Name', 'Contact', 'Balance']
    }
  },
  {
    id: 'sheet-2',
    name: 'Company Sales Pipeline & Leads',
    lastModified: 'Aug 30, 2026',
    owner: 'Me',
    tabs: ['Inbound Leads', 'Qualified Deals', 'Closed Won'],
    tabColumns: {
      'Inbound Leads': ['Full Name', 'Work Email', 'Company', 'Inquiry Topic', 'Date Received'],
      'Qualified Deals': ['Deal Name', 'Value', 'Stage', 'Owner'],
      'Closed Won': ['Account', 'Contract Value', 'Close Date']
    }
  },
  {
    id: 'sheet-3',
    name: 'Candidate Recruiting & Resumes',
    lastModified: 'Sep 02, 2026',
    owner: 'Me',
    tabs: ['Applicants', 'Interview Rounds', 'Offers'],
    tabColumns: {
      'Applicants': ['Full Name', 'Email Address', 'Current Role', 'Years Exp', 'Portfolio Link'],
      'Interview Rounds': ['Candidate', 'Stage', 'Score', 'Next Step'],
      'Offers': ['Name', 'Position', 'Start Date', 'Status']
    }
  },
  {
    id: 'sheet-4',
    name: 'Operations & PO Master Sheet',
    lastModified: 'Aug 22, 2026',
    owner: 'Operations Team',
    tabs: ['Purchase Orders', 'Suppliers', 'Shipments'],
    tabColumns: {
      'Purchase Orders': ['PO Number', 'Supplier', 'Date', 'Total Cost', 'Terms'],
      'Suppliers': ['Vendor Name', 'Contact Email', 'Payment Terms'],
      'Shipments': ['Tracking #', 'Carrier', 'Status']
    }
  }
];

interface OnboardingFlowProps {
  user: UserAccount;
  onComplete: (destination: {
    sheetName: string;
    tabName: string;
    isNewSheet: boolean;
  }) => void;
  onSkipToDashboard?: () => void;
}

export function OnboardingFlow({
  user,
  onComplete
}: OnboardingFlowProps) {
  // Destination mode: 'new' | 'existing'
  const [selectedDestinationType, setSelectedDestinationType] = useState<'new' | 'existing'>('new');
  const [newSheetName, setNewSheetName] = useState('inbox2data — Extracted Records');

  // Existing Sheet Picker details
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedExistingSheet, setSelectedExistingSheet] = useState<DriveSheet>(DRIVE_SHEETS[0]);
  const [selectedTab, setSelectedTab] = useState<string>('Sheet1');

  const handleSelectFromPicker = (sheet: DriveSheet) => {
    setSelectedExistingSheet(sheet);
    const initialTab = sheet.tabs[0] || 'Sheet1';
    setSelectedTab(initialTab);
    setIsPickerOpen(false);
  };

  const handleContinue = () => {
    const isNew = selectedDestinationType === 'new';
    const sheetName = isNew 
      ? (newSheetName.trim() || 'inbox2data — Extracted Records')
      : selectedExistingSheet.name;
    const tabName = isNew ? 'Sheet1' : selectedTab;

    onComplete({
      sheetName,
      tabName,
      isNewSheet: isNew
    });
  };

  const filteredDriveSheets = DRIVE_SHEETS.filter(sheet => 
    sheet.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    sheet.owner.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox2DataBrand size="sm" />
            <div className="h-4 w-px bg-[#e5e7eb]" />
            <span className="text-xs font-medium text-[#5b6882]">Google Sheets Setup</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#5b6882] bg-[#f9fafb] px-3 py-1.5 rounded-full border border-[#e5e7eb]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[#000000] truncate max-w-[160px]">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#006dc8] bg-[#cfe9fd]/40 border border-[#cfe9fd] mx-auto">
            <GoogleSheetsLogo className="w-3.5 h-3.5" />
            <span>Destination Setup</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#000000]">
            Choose where extracted data goes
          </h1>
          <p className="text-sm text-[#5b6882] max-w-lg mx-auto">
            Select how you'd like your incoming emails from Gmail to be recorded into Google Sheets.
          </p>
        </div>

        {/* The 2 Destination Cards */}
        <div className="space-y-4">
          {/* Card 1: Create a new sheet */}
          <div
            onClick={() => setSelectedDestinationType('new')}
            className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer bg-white text-left ${
              selectedDestinationType === 'new'
                ? 'border-[#009afc] ring-2 ring-[#009afc]/20 shadow-sm'
                : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="pt-0.5">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedDestinationType === 'new'
                    ? 'border-[#009afc] bg-[#009afc]'
                    : 'border-[#cbd5e1] bg-white'
                }`}>
                  {selectedDestinationType === 'new' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GoogleSheetsLogo className="w-5 h-5 shrink-0" />
                    <h3 className="text-base font-medium text-[#000000]">Create a new sheet</h3>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Instant & Automatic
                  </span>
                </div>

                <p className="text-xs text-[#5b6882] leading-relaxed">
                  No file picker needed. The app will auto-create a new Google Sheet named after your automation in your Google Drive.
                </p>

                {selectedDestinationType === 'new' && (
                  <div className="pt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#5b6882] uppercase tracking-wider mb-1.5">
                        New Spreadsheet Name
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus-within:border-[#009afc] focus-within:bg-white transition-all">
                        <GoogleSheetsLogo className="w-4 h-4 shrink-0" />
                        <input
                          type="text"
                          value={newSheetName}
                          onChange={(e) => setNewSheetName(e.target.value)}
                          placeholder="e.g., inbox2data — Invoices & Expenses"
                          className="w-full text-xs font-medium text-[#000000] bg-transparent border-none outline-hidden p-0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Pre-formatted with styled headers, frozen top row, and clean gridlines.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Use an existing sheet */}
          <div
            onClick={() => setSelectedDestinationType('existing')}
            className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer bg-white text-left ${
              selectedDestinationType === 'existing'
                ? 'border-[#009afc] ring-2 ring-[#009afc]/20 shadow-sm'
                : 'border-[#e5e7eb] hover:border-[#cbd5e1]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="pt-0.5">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  selectedDestinationType === 'existing'
                    ? 'border-[#009afc] bg-[#009afc]'
                    : 'border-[#cbd5e1] bg-white'
                }`}>
                  {selectedDestinationType === 'existing' && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-amber-500 shrink-0" />
                    <h3 className="text-base font-medium text-[#000000]">Use an existing sheet</h3>
                  </div>
                  <span className="text-[11px] font-medium text-[#006dc8] bg-[#cfe9fd]/40 px-2.5 py-0.5 rounded-full border border-[#cfe9fd]">
                    Google Picker
                  </span>
                </div>

                <p className="text-xs text-[#5b6882] leading-relaxed">
                  Opens the Google Picker widget (Google's native file browser for Drive) to select a spreadsheet you already own and pick a tab.
                </p>

                {selectedDestinationType === 'existing' && (
                  <div className="pt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GoogleSheetsLogo className="w-5 h-5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#000000] truncate">
                            {selectedExistingSheet.name}
                          </div>
                          <div className="text-[11px] text-[#5b6882]">
                            Last edited {selectedExistingSheet.lastModified} • Owner: {selectedExistingSheet.owner}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPickerOpen(true)}
                        className="px-3 py-1.5 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] text-xs font-medium text-[#000000] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                      >
                        <Search className="w-3.5 h-3.5 text-[#5b6882]" />
                        <span>Browse Google Drive</span>
                      </button>
                    </div>

                    {/* Tab Dropdown */}
                    <div>
                      <label className="block text-[10px] font-semibold text-[#5b6882] uppercase tracking-wider mb-1">
                        Destination Tab (Sheet)
                      </label>
                      <div className="relative">
                        <select
                          value={selectedTab}
                          onChange={(e) => setSelectedTab(e.target.value)}
                          className="w-full appearance-none px-3 py-2 bg-white border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#000000] focus:border-[#009afc] focus:outline-hidden pr-8 cursor-pointer"
                        >
                          {selectedExistingSheet.tabs.map(tab => (
                            <option key={tab} value={tab}>
                              {tab} ({selectedExistingSheet.tabColumns[tab]?.length || 0} columns detected)
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#5b6882] absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex items-center justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="surf-btn w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-medium tracking-tight flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Continue to Describe Automation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Google Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#e5e7eb] shadow-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
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

            {/* Search Input */}
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

            {/* Files List */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#f3f4f6]">
              {filteredDriveSheets.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5b6882]">
                  No Google Sheets found matching "{pickerSearch}".
                </div>
              ) : (
                filteredDriveSheets.map(sheet => {
                  const isSelected = selectedExistingSheet.id === sheet.id;
                  return (
                    <div
                      key={sheet.id}
                      onClick={() => handleSelectFromPicker(sheet)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#cfe9fd]/30 border border-[#cfe9fd]' : 'hover:bg-[#f9fafb]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GoogleSheetsLogo className="w-5 h-5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#000000] truncate">
                            {sheet.name}
                          </div>
                          <div className="text-[11px] text-[#5b6882] flex items-center gap-2">
                            <span>Modified {sheet.lastModified}</span>
                            <span>•</span>
                            <span>{sheet.tabs.length} tabs</span>
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="text-xs font-medium text-[#006dc8] flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="text-xs font-medium text-[#5b6882] hover:text-[#000000] px-2.5 py-1 rounded-lg border border-[#e5e7eb] hover:bg-white shrink-0"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between text-xs text-[#5b6882]">
              <div className="flex items-center gap-1.5">
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Drive File Picker</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] text-xs font-medium text-[#000000] transition-colors cursor-pointer"
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
