import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  AlertCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Mail,
  Sparkles,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle,
  X,
  CreditCard
} from 'lucide-react';
import { Automation, ProcessingItem, ReviewItem, UserAccount } from '../types';
import { Inbox2DataBrand, GoogleSheetsLogo, GmailLogo, GoogleLogo } from './Logos';
import { BillingPlansModal } from './BillingPlansModal';

interface DashboardProps {
  user: UserAccount;
  automations: Automation[];
  onNewAutomation: () => void;
  onStartParsing?: (prompt: string) => void;
  onChangeDestination?: () => void;
  onToggleAutomationStatus: (id: string) => void;
  onDeleteAutomation: (id: string) => void;
  onDisconnect: () => void;
  onViewLanding: () => void;
  onUpdateUserPlan?: (newPlan: 'Free Trial' | 'Starter' | 'Pro' | 'Business', newLimit: number) => void;
}

export function Dashboard({
  user,
  automations,
  onNewAutomation,
  onStartParsing,
  onChangeDestination,
  onToggleAutomationStatus,
  onDeleteAutomation,
  onDisconnect,
  onViewLanding,
  onUpdateUserPlan
}: DashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'automations' | 'review' | 'history' | 'settings'>('automations');
  
  // Review Queue state
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Acme Cloud Services <billing@acmecloud.io>',
      subject: 'Acme Cloud Invoice #INV-9022 for Hosting',
      date: '10 minutes ago',
      snippet: 'Thank you for your business. Total charged: $1,420.00 USD (Includes state sales tax & surcharge of $180.00). Subtotal: $1,240.00.',
      extractedFields: {
        'Vendor Name': 'Acme Cloud',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 19, 2026',
        'Invoice #': 'INV-9022',
        'Amount': '$1,420.00'
      },
      uncertainField: 'Amount',
      confidence: 81.5,
      alternativeOptions: ['$1,420.00', '$1,240.00'],
      simpleQuestion: 'Which amount should be written to the spreadsheet?',
      simpleExplanation: 'The invoice contains both a gross amount ($1,420.00) and a pre-tax net subtotal ($1,240.00).',
      optionsWithDetails: [
        {
          value: '$1,420.00',
          label: '$1,420.00 USD',
          description: 'Total charged (includes $180.00 tax & fees)',
          isRecommended: true
        },
        {
          value: '$1,240.00',
          label: '$1,240.00 USD',
          description: 'Net subtotal (before taxes and fees)',
          isRecommended: false
        }
      ]
    },
    {
      id: 'rev-2',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Digital Design Studio <finance@digitaldesign.com>',
      subject: 'Retainer Statement #DD-441 - UI/UX Services',
      date: '1 hour ago',
      snippet: 'Contract retainer for September. Amount: €2,500.00 EUR. Converted USD equivalent: approximately $2,720.00 USD.',
      extractedFields: {
        'Vendor Name': 'Digital Design Studio',
        'Invoice Date': 'Sep 04, 2026',
        'Due Date': 'Sep 18, 2026',
        'Invoice #': 'DD-441',
        'Amount': '€2,500.00'
      },
      uncertainField: 'Amount',
      confidence: 84.0,
      alternativeOptions: ['€2,500.00 EUR', '$2,720.00 USD'],
      simpleQuestion: 'Which currency denomination should be saved?',
      simpleExplanation: 'The invoice is billed in Euros (€2,500.00) but includes an estimated USD equivalent ($2,720.00).',
      optionsWithDetails: [
        {
          value: '€2,500.00',
          label: '€2,500.00 EUR',
          description: 'Original billed currency',
          isRecommended: true
        },
        {
          value: '$2,720.00',
          label: '$2,720.00 USD',
          description: 'Estimated USD conversion',
          isRecommended: false
        }
      ]
    }
  ]);

  // Selected option state for reviews: { [reviewId]: selectedValue }
  const [selectedReviewOptions, setSelectedReviewOptions] = useState<Record<string, string>>({
    'rev-1': '$1,420.00',
    'rev-2': '€2,500.00'
  });

  // Processing History State
  const [historyItems, setHistoryItems] = useState<ProcessingItem[]>([
    {
      id: 'proc-1',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Stripe, Inc. <invoices@stripe.com>',
      subject: 'Your Stripe payment receipt #ST-8819',
      date: '12 minutes ago',
      status: 'success',
      confidence: 99.8,
      extractedData: {
        'Vendor Name': 'Stripe, Inc.',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 19, 2026',
        'Invoice #': 'ST-8819',
        'Amount': '$349.00'
      },
      rawSnippet: 'Your payment of $349.00 has been processed successfully for Stripe Radar & Billing.'
    },
    {
      id: 'proc-2',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Google Workspace <workspace-noreply@google.com>',
      subject: 'Monthly Invoice #GW-550921',
      date: '45 minutes ago',
      status: 'success',
      confidence: 99.4,
      extractedData: {
        'Vendor Name': 'Google Workspace',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 15, 2026',
        'Invoice #': 'GW-550921',
        'Amount': '$72.00'
      },
      rawSnippet: 'Your Google Workspace subscription invoice for 6 users is now available.'
    },
    {
      id: 'proc-3',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Acme Cloud Services <billing@acmecloud.io>',
      subject: 'Acme Cloud Invoice #INV-9022 for Hosting',
      date: '10 minutes ago',
      status: 'flagged',
      confidence: 81.5,
      extractedData: {
        'Vendor Name': 'Acme Cloud',
        'Invoice Date': 'Sep 05, 2026',
        'Due Date': 'Sep 19, 2026',
        'Invoice #': 'INV-9022',
        'Amount': '$1,420.00'
      },
      rawSnippet: 'Thank you for your business. Total charged: $1,420.00 USD. Subtotal: $1,240.00.'
    },
    {
      id: 'proc-4',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'GitHub <billing@github.com>',
      subject: 'Payment Confirmation: GitHub Team Plan',
      date: 'Yesterday at 3:15 PM',
      status: 'success',
      confidence: 99.6,
      extractedData: {
        'Vendor Name': 'GitHub, Inc.',
        'Invoice Date': 'Sep 04, 2026',
        'Due Date': 'Sep 04, 2026',
        'Invoice #': 'GH-33291',
        'Amount': '$44.00'
      },
      rawSnippet: 'Thank you for your payment of $44.00 USD for GitHub Team organization.'
    },
    {
      id: 'proc-5',
      automationId: 'auto-1',
      automationName: 'SaaS & Vendor Invoices Sync',
      sender: 'Figma Billing <invoice@figma.com>',
      subject: 'Figma Organization Invoice #FIG-998',
      date: 'Yesterday at 11:20 AM',
      status: 'success',
      confidence: 98.9,
      extractedData: {
        'Vendor Name': 'Figma, Inc.',
        'Invoice Date': 'Sep 04, 2026',
        'Due Date': 'Sep 18, 2026',
        'Invoice #': 'FIG-998',
        'Amount': '$180.00'
      },
      rawSnippet: 'Your monthly statement for Figma Professional 4 Editor seats.'
    }
  ]);

  // History search and filter
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'success' | 'flagged'>('all');
  const [inspectingItem, setInspectingItem] = useState<ProcessingItem | null>(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Simulate running a test on an automation
  const handleRunTest = (auto: Automation) => {
    showToast(`Simulation started for "${auto.name}". Extracted 1 sample email to "${auto.destinationSheet}".`);
  };

  // Resolve review item
  const handleConfirmReview = (review: ReviewItem) => {
    const chosenValue = selectedReviewOptions[review.id] || review.alternativeOptions[0];
    
    // Add to history as success
    const newHistoryItem: ProcessingItem = {
      id: `proc-${Date.now()}`,
      automationId: review.automationId,
      automationName: review.automationName,
      sender: review.sender,
      subject: review.subject,
      date: 'Just now',
      status: 'success',
      confidence: 100.0,
      extractedData: {
        ...review.extractedFields,
        [review.uncertainField]: chosenValue
      },
      rawSnippet: review.snippet
    };

    setHistoryItems(prev => [newHistoryItem, ...prev]);
    setReviewItems(prev => prev.filter(r => r.id !== review.id));
    showToast(`Resolved! Written to ${user.connectedSheet} with ${review.uncertainField} set to "${chosenValue}".`);
  };

  const handleDismissReview = (id: string) => {
    setReviewItems(prev => prev.filter(r => r.id !== id));
    showToast('Record skipped and discarded from queue.');
  };

  // Filtered history
  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.sender.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.automationName.toLowerCase().includes(historySearch.toLowerCase());

    if (!matchesSearch) return false;
    if (historyFilter === 'all') return true;
    return item.status === historyFilter;
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000000] text-white px-5 py-3 rounded-full text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#009afc]" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={onViewLanding} className="cursor-pointer">
            <Inbox2DataBrand size="default" />
          </div>
        </div>

        {/* Tab Navigation Center */}
        <nav className="flex items-center gap-1 bg-[#f3f4f6] p-1 rounded-full border border-[#e5e7eb]">
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'automations'
                ? 'bg-white text-[#000000] shadow-xs'
                : 'text-[#5b6882] hover:text-[#000000]'
            }`}
          >
            <span>Automations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#e5e7eb] text-[#000000] font-semibold">
              {automations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-white text-[#000000] shadow-xs'
                : 'text-[#5b6882] hover:text-[#000000]'
            }`}
          >
            <span>Needs Review</span>
            {reviewItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-300">
                {reviewItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-[#000000] shadow-xs'
                : 'text-[#5b6882] hover:text-[#000000]'
            }`}
          >
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#000000] shadow-xs'
                : 'text-[#5b6882] hover:text-[#000000]'
            }`}
          >
            <span>Settings</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewAutomation}
            className="surf-btn px-4 py-2 rounded-full text-xs font-medium tracking-tight flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Automation</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
            <span className="text-xs font-medium text-[#5b6882] block mb-1">Active Automations</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-normal text-[#000000]">
                {automations.filter(a => a.status === 'active').length}
              </span>
              <span className="text-xs text-[#5b6882]">/ {automations.length} total</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
            <span className="text-xs font-medium text-[#5b6882] block mb-1">Processed Emails</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-normal text-[#000000]">
                {user.usedEmails.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 font-medium">Synced</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('review')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e7eb] shadow-xs cursor-pointer hover:border-amber-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#5b6882]">Needs Review</span>
              {reviewItems.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-normal text-[#000000]">
                {reviewItems.length}
              </span>
              <span className="text-xs text-[#5b6882]">held extractions</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e5e7eb] shadow-xs">
            <span className="text-xs font-medium text-[#5b6882] block mb-1">Monthly Plan Quota</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-normal text-[#000000]">
                {Math.round((user.usedEmails / user.planLimit) * 100)}%
              </span>
              <span className="text-xs text-[#5b6882]">({user.usedEmails}/{user.planLimit})</span>
            </div>
          </div>
        </div>

        {/* 1. TAB: AUTOMATIONS */}
        {activeTab === 'automations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-normal text-[#000000] tracking-tight">
                  Active Automations
                </h2>
                <p className="text-xs text-[#5b6882] mt-0.5">
                  Natural language extraction pipelines watching your connected Gmail inbox.
                </p>
              </div>
            </div>

            {automations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#cfe9fd]/50 text-[#009afc] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium text-[#000000]">No automations created yet</h3>
                  <p className="text-xs text-[#5b6882] max-w-sm mx-auto">
                    Describe what emails you want to watch and what information to extract into your Google Sheets.
                  </p>
                </div>
                <button
                  onClick={onNewAutomation}
                  className="surf-btn px-5 py-2 rounded-full text-xs font-medium cursor-pointer"
                >
                  Create Your First Automation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {automations.map(auto => {
                  const isActive = auto.status === 'active';

                  return (
                    <div
                      key={auto.id}
                      className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs hover:border-[#d1d5db] transition-all space-y-5"
                    >
                      {/* Automation Header: Status & Actions */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-semibold text-[#000000]">
                              {auto.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                              <span>{isActive ? 'Active & Watching' : 'Paused'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#5b6882]">
                            <GoogleSheetsLogo className="w-3.5 h-3.5" />
                            <span className="text-[#000000] font-medium">{auto.destinationSheet}</span>
                            <span>•</span>
                            <span>Created {auto.createdAt}</span>
                          </div>
                        </div>

                        {/* Status Toggle & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleAutomationStatus(auto.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isActive
                                ? 'border-[#e5e7eb] text-[#5b6882] hover:text-[#000000] hover:bg-[#f9fafb]'
                                : 'border-[#009afc] text-[#006dc8] bg-[#cfe9fd]/30 hover:bg-[#cfe9fd]/50'
                            }`}
                            title={isActive ? "Pause automation" : "Resume automation"}
                          >
                            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            <span>{isActive ? 'Pause' : 'Activate'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${auto.name}"?`)) {
                                onDeleteAutomation(auto.id);
                              }
                            }}
                            className="p-1.5 text-[#9ca3af] hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete automation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Plain English Instruction Box */}
                      <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-4 space-y-2 text-left">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5b6882] block">
                          Extraction Prompt
                        </span>
                        <p className="text-xs text-[#000000] leading-relaxed font-normal italic">
                          "{auto.plainEnglishPrompt}"
                        </p>
                      </div>

                      {/* Extracted Schema Fields */}
                      <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5b6882] block">
                          Captured Columns ({auto.fields.length} fields)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {auto.fields.map(field => (
                            <span
                              key={field.id}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f3f4f6] text-[#000000] border border-[#e5e7eb] flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#009afc]" />
                              <span>{field.columnHeader || field.name}</span>
                              <span className="text-[10px] text-[#808080] uppercase">({field.type})</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer: Metrics & Run Test */}
                      <div className="pt-4 border-t border-[#f3f4f6] flex items-center justify-between text-xs text-[#5b6882]">
                        <div className="flex items-center gap-3">
                          <span><strong>{auto.processedCount}</strong> emails processed</span>
                          <span>•</span>
                          <span>Last run: {auto.lastRunAt}</span>
                        </div>

                        <button
                          onClick={() => handleRunTest(auto)}
                          className="px-3 py-1 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#000000] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-[#009afc]" />
                          <span>Run test simulation</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. TAB: NEEDS REVIEW */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-normal text-[#000000] tracking-tight">
                Review Queue
              </h2>
              <p className="text-xs text-[#5b6882] mt-0.5">
                Low-confidence or ambiguous extractions held for your 1-click confirmation before writing to Google Sheets.
              </p>
            </div>

            {reviewItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-medium text-[#000000]">All caught up!</h3>
                <p className="text-xs text-[#5b6882] max-w-sm mx-auto">
                  Every recent email was extracted with high confidence (&gt;95%) and written directly to your spreadsheets.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>{reviewItems.length} items require confirmation.</strong> Review the details below and select your preferred value.
                  </span>
                </div>

                {reviewItems.map(item => {
                  const selectedVal = selectedReviewOptions[item.id] || item.alternativeOptions[0];

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs space-y-5 text-left"
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-[#006dc8] uppercase tracking-wider">
                            {item.automationName}
                          </span>
                          <h3 className="text-base font-semibold text-[#000000]">
                            {item.subject}
                          </h3>
                          <div className="text-xs text-[#5b6882] flex items-center gap-2">
                            <span>{item.sender}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          {item.confidence}% confidence
                        </span>
                      </div>

                      {/* Email Snippet */}
                      <div className="bg-[#f9fafb] p-3.5 rounded-xl border border-[#e5e7eb] text-xs text-[#5b6882] leading-relaxed">
                        <span className="font-medium text-[#000000] block mb-1">Incoming Email Snippet:</span>
                        "{item.snippet}"
                      </div>

                      {/* Friendly AI Question & Options */}
                      <div className="p-4 rounded-xl bg-[#cfe9fd]/20 border border-[#cfe9fd] space-y-3">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-[#006dc8] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#009afc]" />
                            <span>{item.simpleQuestion}</span>
                          </span>
                          <p className="text-xs text-[#5b6882]">
                            {item.simpleExplanation}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {item.optionsWithDetails?.map(opt => {
                            const isSelected = selectedVal === opt.value;

                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedReviewOptions(prev => ({ ...prev, [item.id]: opt.value }))}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-white border-[#009afc] shadow-xs ring-2 ring-[#009afc]/20'
                                    : 'bg-white/60 border-[#e5e7eb] hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-[#000000]">
                                    {opt.label}
                                  </span>
                                  {opt.isRecommended && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      Recommended
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-[#5b6882] leading-normal">
                                  {opt.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Confirm / Skip Buttons */}
                      <div className="pt-2 flex items-center justify-between border-t border-[#f3f4f6]">
                        <button
                          onClick={() => handleDismissReview(item.id)}
                          className="text-xs font-medium text-[#5b6882] hover:text-[#000000] px-3 py-1.5 rounded-full hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                        >
                          Skip & Do Not Record
                        </button>

                        <button
                          onClick={() => handleConfirmReview(item)}
                          className="surf-btn px-5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm & Send to Google Sheets</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-normal text-[#000000] tracking-tight">
                  Processing Audit Stream
                </h2>
                <p className="text-xs text-[#5b6882] mt-0.5">
                  Real-time log of incoming emails parsed and written to your spreadsheets.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search logs..."
                    className="pl-8 pr-3 py-1.5 rounded-full border border-[#e5e7eb] bg-white text-xs text-[#000000] placeholder:text-[#9ca3af] focus:outline-hidden focus:border-[#009afc] w-48"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#e5e7eb] rounded-full p-0.5 text-xs">
                  <button
                    onClick={() => setHistoryFilter('all')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      historyFilter === 'all' ? 'bg-[#000000] text-white font-medium' : 'text-[#5b6882]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setHistoryFilter('success')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      historyFilter === 'success' ? 'bg-[#000000] text-white font-medium' : 'text-[#5b6882]'
                    }`}
                  >
                    Success
                  </button>
                  <button
                    onClick={() => setHistoryFilter('flagged')}
                    className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                      historyFilter === 'flagged' ? 'bg-[#000000] text-white font-medium' : 'text-[#5b6882]'
                    }`}
                  >
                    Flagged
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[#5b6882] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Subject & Sender</th>
                    <th className="py-3 px-4">Destination Sheet</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {filteredHistory.map(item => (
                    <tr key={item.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className="py-3.5 px-4 text-[#5b6882] whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-[#000000] block truncate">
                          {item.subject}
                        </span>
                        <span className="text-[11px] text-[#5b6882] truncate block">
                          {item.sender}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#5b6882]">
                          <GoogleSheetsLogo className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[#000000] font-medium truncate max-w-[150px]">
                            {user.connectedSheet}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            item.confidence >= 95 ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {item.confidence.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Synced</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            <span>Held</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setInspectingItem(item)}
                          className="text-[#006dc8] hover:text-[#009afc] font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredHistory.length === 0 && (
                <div className="p-8 text-center text-xs text-[#5b6882]">
                  No history records matched your search query.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TAB: SETTINGS & BILLING */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-normal text-[#000000] tracking-tight">
                Settings & Connections
              </h2>
              <p className="text-xs text-[#5b6882] mt-0.5">
                Manage your Google account authorizations, default destinations, and plan quota.
              </p>
            </div>

            {/* Google OAuth Account Card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#cfe9fd]/40 flex items-center justify-center text-[#009afc]">
                    <GoogleLogo className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#000000]">Connected Google Account</h3>
                    <p className="text-xs text-[#5b6882]">{user.email}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Authorized</span>
                </span>
              </div>

              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-between text-xs">
                <div className="text-[#5b6882]">
                  <span>Scope: Read-only Gmail metadata + Google Sheets write access</span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Account</span>
                </button>
              </div>
            </div>

            {/* Default Google Sheet Card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <GoogleSheetsLogo className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#000000]">Default Target Spreadsheet</h3>
                    <p className="text-xs text-[#5b6882]">{user.connectedSheet}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {onChangeDestination && (
                    <button
                      type="button"
                      onClick={onChangeDestination}
                      className="text-xs font-medium text-[#006dc8] hover:text-[#009afc] px-3 py-1.5 rounded-full bg-[#cfe9fd]/40 border border-[#cfe9fd] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Configure Destination & Columns</span>
                    </button>
                  )}

                  <a
                    href="https://sheets.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#5b6882] hover:text-[#000000] flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#e5e7eb] hover:bg-[#f3f4f6] transition-colors"
                  >
                    <span>Open in Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Plan Quota Card */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#000000]">Subscription Plan</h3>
                  <p className="text-xs text-[#5b6882]">{user.plan} Plan • {user.planLimit.toLocaleString()} extractions / month</p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#000000] text-white">
                  Active
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#5b6882]">
                  <span>Monthly volume usage</span>
                  <span className="font-semibold text-[#000000]">
                    {user.usedEmails.toLocaleString()} / {user.planLimit.toLocaleString()} ({Math.round((user.usedEmails / user.planLimit) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                  <div 
                    className="h-full bg-[#009afc] rounded-full transition-all duration-500" 
                    style={{ width: `${(user.usedEmails / user.planLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
                <span className="text-xs text-[#5b6882]">Renews automatically on Oct 01, 2026</span>
                <button
                  type="button"
                  onClick={() => setIsBillingModalOpen(true)}
                  className="text-xs font-medium text-[#006dc8] hover:underline cursor-pointer"
                >
                  Upgrade or manage billing
                </button>
              </div>
            </div>

            {/* Account Session & Sign Out */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#000000]">Account Session</h3>
                  <p className="text-xs text-[#5b6882]">Active workspace session for {user.email}.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Active Session</span>
                </span>
              </div>

              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
                <span className="text-xs text-[#5b6882]">End your current session and return to home</span>
                <button
                  id="signet-button"
                  data-testid="signout-button"
                  onClick={onDisconnect}
                  className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Security, Privacy & Signet */}
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl p-5 space-y-3 text-xs text-[#5b6882]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#000000] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enterprise Security & OAuth Signet</span>
                </div>
                <button
                  id="signet-action-btn"
                  onClick={() => showToast("Google OAuth 2.0 Signet verified and active (TLS 1.3 / SHA-256).")}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] text-xs font-medium text-[#000000] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#009afc]" />
                  <span>Signet</span>
                </button>
              </div>
              <p className="leading-relaxed">
                inbox2data runs on Google Cloud with strict end-to-end TLS encryption and verified OAuth credentials. We never sell your data, never train public AI models on your private messages, and only inspect emails that match your explicitly configured prompts.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Inspect Item Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#e5e7eb] shadow-xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
              <div>
                <h3 className="text-base font-semibold text-[#000000]">Extracted Payload</h3>
                <p className="text-xs text-[#5b6882]">{inspectingItem.subject}</p>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="text-[#9ca3af] hover:text-[#000000] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#5b6882] uppercase tracking-wider block">
                Extracted Field Values
              </span>
              <div className="bg-[#f9fafb] rounded-xl p-4 border border-[#e5e7eb] space-y-2.5">
                {Object.entries(inspectingItem.extractedData).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#5b6882]">{key}:</span>
                    <span className="font-semibold text-[#000000]">{val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#5b6882] uppercase tracking-wider block">
                  Raw Email Excerpt
                </span>
                <p className="text-xs text-[#5b6882] italic bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb]">
                  "{inspectingItem.rawSnippet}"
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f3f4f6] flex justify-end">
              <button
                onClick={() => setInspectingItem(null)}
                className="surf-btn px-5 py-2 rounded-full text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing & Subscription Plans Modal */}
      <BillingPlansModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        user={user}
        onUpdatePlan={(newPlan, newLimit) => {
          if (onUpdateUserPlan) {
            onUpdateUserPlan(newPlan, newLimit);
          }
        }}
        onShowToast={showToast}
      />
    </div>
  );
}
