import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Folder, 
  ShieldCheck, 
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { GoogleSheetsLogo, GoogleLogo, Inbox2DataBrand } from './Logos';
import { ExtractedField, DataType, Automation } from '../types';
import { DRIVE_SHEETS, DriveSheet } from './OnboardingFlow';
import { DestinationConfig } from './ChooseDestinationStep';

interface ParsedAutomationViewProps {
  promptText: string;
  destinationConfig: DestinationConfig;
  onActivate: (automation: Automation) => void;
  onBackToDestination: () => void;
  userEmail: string;
}

export function ParsedAutomationView({
  promptText,
  destinationConfig,
  onActivate,
  onBackToDestination,
  userEmail
}: ParsedAutomationViewProps) {
  // Infer initial fields based on prompt
  const isInvoice = promptText.toLowerCase().includes('invoice') || 
                    promptText.toLowerCase().includes('receipt') || 
                    promptText.toLowerCase().includes('vendor') ||
                    promptText.toLowerCase().includes('billing');
  
  const [automationName, setAutomationName] = useState(
    isInvoice ? "SaaS & Vendor Invoices Sync" : "Incoming Email Data Extraction"
  );
  
  const [triggerRule, setTriggerRule] = useState(
    isInvoice 
      ? "from:(*billing* OR *invoice* OR *receipt* OR *stripe* OR *statements*) has:attachment OR contains:('invoice' OR 'amount' OR 'total')" 
      : "matches: incoming messages matching user-specified subject keywords and body payload"
  );

  // Dynamic destination sheet selection state (dependent on step 2)
  const [currentSheetName, setCurrentSheetName] = useState(destinationConfig.sheetName);
  const [currentTabName, setCurrentTabName] = useState(destinationConfig.tabName);
  const [isAutoCreate, setIsAutoCreate] = useState(destinationConfig.type === 'new');
  
  const [isChangingDestination, setIsChangingDestination] = useState(false);
  const [destType, setDestType] = useState<'new' | 'existing'>(destinationConfig.type);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedSheet, setSelectedSheet] = useState<DriveSheet>(
    DRIVE_SHEETS.find(s => s.name === destinationConfig.sheetName) || DRIVE_SHEETS[0]
  );

  const [fields, setFields] = useState<ExtractedField[]>(
    isInvoice
      ? [
          { id: '1', name: 'Vendor Name', type: 'TEXT', columnHeader: 'Vendor Name', exampleValue: 'Stripe, Inc.' },
          { id: '2', name: 'Invoice Date', type: 'DATE', columnHeader: 'Invoice Date', exampleValue: 'Sep 05, 2026' },
          { id: '3', name: 'Due Date', type: 'DATE', columnHeader: 'Due Date', exampleValue: 'Sep 19, 2026' },
          { id: '4', name: 'Invoice Number', type: 'TEXT', columnHeader: 'Invoice #', exampleValue: 'ST-8819' },
          { id: '5', name: 'Total Amount', type: 'CURRENCY', columnHeader: 'Amount', exampleValue: '$349.00' }
        ]
      : [
          { id: '1', name: 'Sender Name', type: 'TEXT', columnHeader: 'Full Name', exampleValue: 'Jordan Lee' },
          { id: '2', name: 'Contact Email', type: 'EMAIL', columnHeader: 'Email', exampleValue: 'jordan@acme.co' },
          { id: '3', name: 'Inquiry Topic', type: 'TEXT', columnHeader: 'Topic', exampleValue: 'Enterprise Plan Pricing' },
          { id: '4', name: 'Received Date', type: 'DATE', columnHeader: 'Date', exampleValue: 'Sep 05, 2026' },
          { id: '5', name: 'Message Notes', type: 'TEXT', columnHeader: 'Summary Notes', exampleValue: 'Requested custom API contract' }
        ]
  );

  // Test rows for recent email preview
  const testRows = [
    {
      id: 'row-1',
      sender: 'Stripe, Inc. <invoicing@stripe.com>',
      subject: 'Invoice #ST-8819 for Cloud Hosting',
      confidence: 99.8,
      data: {
        'Vendor Name': 'Stripe, Inc.',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 19, 2026',
        'Invoice #': 'ST-8819',
        'Amount': '$349.00',
        'Full Name': 'Jordan Lee',
        'Email': 'jordan@acme.co',
        'Topic': 'Enterprise Plan Pricing',
        'Date': 'Sep 05, 2026',
        'Summary Notes': 'Requested demo'
      } as Record<string, string>
    },
    {
      id: 'row-2',
      sender: 'Google Workspace <billing-noreply@google.com>',
      subject: 'Monthly invoice GW-550921 is now available',
      confidence: 99.4,
      data: {
        'Vendor Name': 'Google Workspace',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 15, 2026',
        'Invoice #': 'GW-550921',
        'Amount': '$72.00',
        'Full Name': 'Sarah Connor',
        'Email': 'sarah@cyberdyne.io',
        'Topic': 'Security Audit Add-on',
        'Date': 'Sep 04, 2026',
        'Summary Notes': 'Signed enterprise MSA'
      } as Record<string, string>
    },
    {
      id: 'row-3',
      sender: 'Acme Hardware Supplies <orders@acmehardware.com>',
      subject: 'Tax Receipt & Shipping manifest for Order #554',
      confidence: 98.7,
      data: {
        'Vendor Name': 'Acme Hardware',
        'Invoice Date': 'Aug 28, 2026',
        'Due Date': 'Aug 28, 2026',
        'Invoice #': 'ORD-554',
        'Amount': '$782.30',
        'Full Name': 'David Miller',
        'Email': 'david@apex.com',
        'Topic': 'Bulk Logistics Order',
        'Date': 'Aug 28, 2026',
        'Summary Notes': 'PO verified'
      } as Record<string, string>
    }
  ];

  const [activeTab, setActiveTab] = useState<'schema' | 'preview'>('schema');

  const handleAddField = () => {
    const newId = String(Date.now());
    const nextLetter = String.fromCharCode(65 + fields.length);
    setFields([
      ...fields,
      {
        id: newId,
        name: `Field ${nextLetter}`,
        type: 'TEXT',
        columnHeader: `Column ${nextLetter}`,
        exampleValue: 'Sample Value'
      }
    ]);
  };

  const handleRemoveField = (id: string) => {
    if (fields.length <= 1) return;
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (id: string, key: keyof ExtractedField, value: string) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        if (key === 'name') {
          return { ...f, name: value, columnHeader: value };
        }
        return { ...f, [key]: value };
      }
      return f;
    }));
  };

  const handleActivateClick = () => {
    const newAutomation: Automation = {
      id: `auto-${Date.now()}`,
      name: automationName,
      plainEnglishPrompt: promptText,
      triggerRule: triggerRule,
      destinationSheet: `${currentSheetName} (${currentTabName})`,
      fields: fields,
      status: 'active',
      processedCount: 0,
      needsReviewCount: 0,
      lastRunAt: 'Just now',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    onActivate(newAutomation);
  };

  // Sample values for row 2 and row 3 in the live preview
  const getSampleRowValue = (field: ExtractedField, rowIndex: number) => {
    const fieldLower = (field.columnHeader || field.name).toLowerCase();
    if (fieldLower.includes('vendor') || fieldLower.includes('name') || fieldLower.includes('sender') || fieldLower.includes('company')) {
      return rowIndex === 1 ? 'Stripe, Inc.' : 'Google Workspace';
    }
    if (fieldLower.includes('due')) {
      return rowIndex === 1 ? 'Sep 19, 2026' : 'Sep 15, 2026';
    }
    if (fieldLower.includes('date')) {
      return rowIndex === 1 ? 'Sep 05, 2026' : 'Sep 05, 2026';
    }
    if (fieldLower.includes('#') || fieldLower.includes('num') || fieldLower.includes('id')) {
      return rowIndex === 1 ? 'ST-8819' : 'GW-550921';
    }
    if (fieldLower.includes('amount') || fieldLower.includes('total') || fieldLower.includes('price') || fieldLower.includes('cost') || field.type === 'CURRENCY') {
      return rowIndex === 1 ? '$349.00' : '$72.00';
    }
    if (field.type === 'EMAIL') {
      return rowIndex === 1 ? 'billing@stripe.com' : 'billing@google.com';
    }
    return rowIndex === 1 ? (field.exampleValue || 'Sample Data') : 'Confirmed';
  };

  const filteredDriveSheets = DRIVE_SHEETS.filter(sheet => 
    sheet.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    sheet.owner.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDestination}
              className="flex items-center gap-1.5 text-xs font-medium text-[#5b6882] hover:text-[#000000] py-1.5 px-3 rounded-full hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Destination</span>
            </button>
            <div className="h-4 w-px bg-[#e5e7eb]" />
            <Inbox2DataBrand size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#5b6882] bg-[#f9fafb] px-3 py-1.5 rounded-full border border-[#e5e7eb]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[#000000] truncate max-w-[140px]">{userEmail}</span>
            </div>
            <button
              onClick={handleActivateClick}
              className="surf-btn px-5 py-2 rounded-full text-xs font-medium tracking-tight flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Activate Automation</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        {/* Title Area */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#000000] tracking-tight">
            Review your automation structure
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6882] mt-1">
            Review the extracted columns, trigger condition, and sample extractions before saving.
          </p>
        </div>

        {/* Section 1: Automation Parameters & Destination Sheet */}
        <div
          className="bg-white border border-[#e5e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Automation Name */}
            <div>
              <label className="block text-xs font-semibold text-[#5b6882] uppercase tracking-[0.05em] mb-1.5">
                AUTOMATION NAME
              </label>
              <input
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f9fafb] text-xs sm:text-sm text-[#000000] font-medium border border-[#e5e7eb] rounded-xl focus:border-[#009afc] focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            {/* Destination Google Sheet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#5b6882] uppercase tracking-[0.05em]">
                  DESTINATION GOOGLE SHEET
                </label>
                <button
                  type="button"
                  onClick={() => setIsChangingDestination(!isChangingDestination)}
                  className="text-[11px] text-[#006dc8] hover:text-[#009afc] font-medium transition-colors cursor-pointer"
                >
                  {isChangingDestination ? "Done" : "Change destination"}
                </button>
              </div>

              {!isChangingDestination ? (
                <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl">
                  <GoogleSheetsLogo className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-[#000000] truncate flex-1">
                    {currentSheetName} ({currentTabName})
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shrink-0 ${
                    isAutoCreate
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-[#006dc8] bg-[#cfe9fd]/40 border-[#cfe9fd]"
                  }`}>
                    {isAutoCreate ? "Auto-create" : "Drive Linked"}
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-[#f9fafb] border border-[#cfe9fd] rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-[#000000] cursor-pointer">
                      <input
                        type="radio"
                        checked={destType === 'new'}
                        onChange={() => {
                          setDestType('new');
                          setIsAutoCreate(true);
                          setCurrentSheetName(destinationConfig.sheetName || `${automationName} — Sheetflow`);
                          setCurrentTabName('Sheet1');
                        }}
                      />
                      <span>Create new sheet</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-[#000000] cursor-pointer">
                      <input
                        type="radio"
                        checked={destType === 'existing'}
                        onChange={() => {
                          setDestType('existing');
                          setIsAutoCreate(false);
                          setCurrentSheetName(selectedSheet.name);
                          setCurrentTabName(selectedSheet.tabs[0] || 'Sheet1');
                        }}
                      />
                      <span>Pick existing sheet</span>
                    </label>
                  </div>

                  {destType === 'new' ? (
                    <input
                      type="text"
                      value={currentSheetName}
                      onChange={(e) => setCurrentSheetName(e.target.value)}
                      placeholder="Spreadsheet name..."
                      className="w-full px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-medium text-[#000000] outline-hidden focus:border-[#009afc]"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPickerOpen(true)}
                        className="px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-medium text-[#000000] hover:bg-[#f3f4f6] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Folder className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate max-w-[150px]">{currentSheetName}</span>
                      </button>

                      <select
                        value={currentTabName}
                        onChange={(e) => {
                          setCurrentTabName(e.target.value);
                        }}
                        className="px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-medium text-[#000000] outline-hidden cursor-pointer"
                      >
                        {selectedSheet.tabs.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Trigger Rule */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#5b6882] uppercase tracking-[0.05em]">
                GMAIL FILTER & TRIGGER RULE
              </label>
              <span className="text-[11px] text-[#808080]">Editable Gmail search syntax</span>
            </div>
            <textarea
              rows={2}
              value={triggerRule}
              onChange={(e) => setTriggerRule(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#f9fafb] text-xs text-[#000000] font-mono border border-[#e5e7eb] rounded-xl focus:border-[#009afc] focus:bg-white focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Section 2: Tabs Switcher */}
        <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? "bg-[#000000] text-white"
                : "bg-white text-[#5b6882] border border-[#e5e7eb] hover:text-[#000000]"
            }`}
          >
            Spreadsheet Columns ({fields.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? "bg-[#000000] text-white"
                : "bg-white text-[#5b6882] border border-[#e5e7eb] hover:text-[#000000]"
            }`}
          >
            <span>Recent Email Sample Preview</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>
        </div>

        {/* Tab 1: Column Schema & Live Google Sheets Preview */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            {/* Top Explainer */}
            <div>
              <h2 className="text-lg font-medium text-[#000000]">
                We'll add these columns to your sheet
              </h2>
              <p className="text-xs text-[#5b6882] mt-0.5">
                Review the columns we'll create in your spreadsheet. You can edit names, reorder, or add custom fields.
              </p>
            </div>

            {/* Editable Columns Card */}
            <div
              className="bg-white border border-[#e5e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
              style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f3f4f6] gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-[#5b6882] uppercase tracking-wider block">
                    SPREADSHEET HEADER ROW (EDITABLE)
                  </span>
                  <span className="text-xs text-[#808080]">
                    Click any column title to edit its header name in the final Google Sheet.
                  </span>
                </div>

                <button
                  onClick={handleAddField}
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#006dc8] hover:text-[#009afc] px-3 py-1.5 rounded-full bg-[#cfe9fd]/30 hover:bg-[#cfe9fd]/50 transition-colors cursor-pointer w-fit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              </div>

              {/* Editable Column Rows */}
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const colLetter = String.fromCharCode(65 + index);
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#e5e7eb] hover:border-[#cbd5e1] bg-[#ffffff] transition-all shadow-2xs"
                    >
                      {/* Letter badge + Field Label */}
                      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                        <div className="w-7 h-7 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center text-xs font-bold text-[#000000] shrink-0 font-mono">
                          {colLetter}
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-semibold text-[#808080] uppercase tracking-wider block">
                            FIELD LABEL
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                            className="text-xs sm:text-sm font-medium text-[#000000] bg-transparent border-none outline-hidden w-full focus:ring-1 focus:ring-[#009afc] rounded px-1 -mx-1"
                          />
                        </div>
                      </div>

                      {/* Sheet Column Header */}
                      <div className="flex-1 min-w-[170px]">
                        <label className="text-[10px] font-semibold text-[#808080] uppercase tracking-wider block">
                          SHEET COLUMN HEADER
                        </label>
                        <input
                          type="text"
                          value={field.columnHeader}
                          onChange={(e) => handleUpdateField(field.id, 'columnHeader', e.target.value)}
                          className="text-xs font-medium text-[#006dc8] bg-transparent border-none outline-hidden w-full focus:ring-1 focus:ring-[#009afc] rounded px-1 -mx-1"
                        />
                      </div>

                      {/* Data Type & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div>
                          <label className="text-[10px] font-semibold text-[#808080] uppercase tracking-wider block">
                            DATA TYPE
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(field.id, 'type', e.target.value as DataType)}
                            className="text-xs font-medium text-[#006dc8] bg-[#cfe9fd]/30 border border-[#cfe9fd] rounded-lg px-2.5 py-1 outline-hidden cursor-pointer"
                          >
                            <option value="TEXT">TEXT</option>
                            <option value="CURRENCY">CURRENCY</option>
                            <option value="DATE">DATE</option>
                            <option value="NUMBER">NUMBER</option>
                            <option value="EMAIL">EMAIL</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          disabled={fields.length <= 1}
                          className="p-1.5 text-[#808080] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#808080] cursor-pointer"
                          title="Remove Field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE GOOGLE SHEETS PREVIEW (Exact Design Requested) */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-xs">
              {/* Sheets Window Header Bar */}
              <div className="px-4 py-2.5 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <GoogleSheetsLogo className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold text-[#000000] truncate">
                    {currentSheetName}
                  </span>
                  <span className="text-[11px] text-[#808080] hidden sm:inline">
                    All changes saved in Drive
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Preview</span>
                </div>
              </div>

              {/* Formula Bar */}
              <div className="px-4 py-1.5 bg-[#ffffff] border-b border-[#e5e7eb] flex items-center gap-3 text-xs font-mono">
                <span className="italic font-serif font-bold text-[#808080]">fx</span>
                <span className="text-[#808080]">|</span>
                <span className="text-[#006dc8] font-mono text-[11px] truncate">
                  =INBOX2DATA_SYNC("{automationName}")
                </span>
              </div>

              {/* Spreadsheet Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  {/* Column Letters Row (A, B, C, D, E...) */}
                  <thead>
                    <tr className="bg-[#f3f4f6] text-[#5b6882] text-center text-[11px] font-mono">
                      <th className="w-10 py-1.5 px-2 border-r border-b border-[#e5e7eb] bg-[#f9fafb]"></th>
                      {fields.map((_, idx) => (
                        <th 
                          key={idx} 
                          className="py-1.5 px-4 border-r border-b border-[#e5e7eb] font-semibold min-w-[130px]"
                        >
                          {String.fromCharCode(65 + idx)}
                        </th>
                      ))}
                    </tr>

                    {/* Row 1: Headers */}
                    <tr className="bg-[#f9fafb] text-[#000000] font-semibold">
                      <td className="py-2 px-2 text-center text-[11px] font-mono text-[#5b6882] border-r border-b border-[#e5e7eb] bg-[#f3f4f6]">
                        1
                      </td>
                      {fields.map((field) => (
                        <td 
                          key={field.id} 
                          className="py-2 px-4 border-r border-b border-[#e5e7eb] font-medium text-[#000000]"
                        >
                          {field.columnHeader || field.name}
                        </td>
                      ))}
                    </tr>
                  </thead>

                  {/* Row 2 & Row 3: Live Values */}
                  <tbody>
                    {/* Row 2 */}
                    <tr className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-2 px-2 text-center text-[11px] font-mono text-[#5b6882] border-r border-b border-[#e5e7eb] bg-[#f3f4f6]">
                        2
                      </td>
                      {fields.map((field) => (
                        <td 
                          key={field.id} 
                          className="py-2 px-4 border-r border-b border-[#e5e7eb] text-[#000000] font-normal"
                        >
                          {getSampleRowValue(field, 1)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-2 px-2 text-center text-[11px] font-mono text-[#5b6882] border-r border-b border-[#e5e7eb] bg-[#f3f4f6]">
                        3
                      </td>
                      {fields.map((field) => (
                        <td 
                          key={field.id} 
                          className="py-2 px-4 border-r border-b border-[#e5e7eb] text-[#000000] font-normal"
                        >
                          {getSampleRowValue(field, 2)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Sheet Tab Footer Bar */}
              <div className="px-4 py-2 bg-[#f3f4f6] border-t border-[#e5e7eb] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e5e7eb] border-b-2 border-b-emerald-600 rounded-t-md font-medium text-[#000000] shadow-2xs">
                    <GoogleSheetsLogo className="w-3 h-3" />
                    <span>{currentTabName}</span>
                  </div>
                  <button 
                    type="button" 
                    className="p-1 rounded text-[#5b6882] hover:text-[#000000] hover:bg-[#e5e7eb] cursor-pointer"
                    title="Add sheet"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-medium text-[#5b6882]">
                  100% Zoom
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sample Email Extraction Preview */}
        {activeTab === 'preview' && (
          <div
            className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4 overflow-x-auto"
            style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#f3f4f6]">
              <div className="text-xs font-medium text-[#5b6882]">
                Simulated extraction preview on 3 recent incoming messages
              </div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>High confidence extractions</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5e7eb] text-[#5b6882] bg-[#f9fafb]">
                    <th className="py-2.5 px-3 font-medium">Source Email</th>
                    {fields.map((f) => (
                      <th key={f.id} className="py-2.5 px-3 font-medium">
                        {f.columnHeader}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 font-medium text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {testRows.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-3 px-3 max-w-[220px]">
                        <div className="font-medium text-[#000000] truncate">{row.sender}</div>
                        <div className="text-[11px] text-[#5b6882] truncate">{row.subject}</div>
                      </td>
                      {fields.map((f) => {
                        const val = row.data[f.columnHeader] || row.data[f.name] || f.exampleValue;
                        return (
                          <td key={f.id} className="py-3 px-3 font-medium text-[#000000]">
                            <span className="px-2 py-0.5 rounded-md bg-[#f3f4f6]">
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.confidence}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            onClick={onBackToDestination}
            className="text-xs font-medium text-[#5b6882] hover:text-[#000000] transition-colors cursor-pointer"
          >
            ← Back to destination selection
          </button>

          <button
            onClick={handleActivateClick}
            className="surf-btn px-6 py-2.5 rounded-full text-xs font-medium tracking-tight flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Activate Automation</span>
          </button>
        </div>
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
                      const t = sheet.tabs[0] || 'Sheet1';
                      setCurrentSheetName(sheet.name);
                      setCurrentTabName(t);
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
                      <button className="text-xs font-medium text-[#5b6882] px-2.5 py-1 rounded-lg border border-[#e5e7eb]">
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
                className="px-4 py-1.5 rounded-lg border border-[#e5e7eb] bg-white text-xs font-medium text-[#000000]"
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
