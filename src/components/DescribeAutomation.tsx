import React, { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Inbox2DataBrand } from './Logos';

interface DescribeAutomationProps {
  onStartParsing: (prompt: string) => void;
  onBack: () => void;
  initialPrompt?: string;
  userEmail: string;
}

export function DescribeAutomation({
  onStartParsing,
  onBack,
  initialPrompt = "",
  userEmail
}: DescribeAutomationProps) {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
    "Whenever I get an invoice or receipt email, extract the vendor name, invoice date, due date, invoice number, and total amount."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onStartParsing(prompt.trim());
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000] flex flex-col">
      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#5b6882] hover:text-[#000000] transition-colors py-2 px-3 rounded-full hover:bg-white/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <Inbox2DataBrand size="default" />

        <div className="flex items-center gap-2 text-xs font-medium text-[#5b6882] bg-white px-3 py-1.5 rounded-full border border-[#e5e7eb] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{userEmail}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#006dc8] bg-[#cfe9fd]/50 border border-[#cfe9fd] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#009afc]" />
              New Automation
            </span>
            <h1 className="text-3xl sm:text-4xl text-[#000000] tracking-tight font-normal mb-3">
              Describe what data you want to extract
            </h1>
            <p className="text-sm sm:text-base text-[#5b6882] max-w-lg mx-auto leading-relaxed">
              Write in plain English. Describe what emails to watch for, and what information you want captured into your Google Sheet.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className="bg-white border border-[#e5e7eb] rounded-[28px] p-6 sm:p-7 shadow-xs hover:border-[#d1d1d1] transition-all focus-within:border-[#009afc] focus-within:ring-4 focus-within:ring-[#cfe9fd]/40"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.04) 0px 2px 4px 0px"
              }}
            >
              <label htmlFor="promptInput" className="block text-xs font-medium text-[#5b6882] mb-2 uppercase tracking-[0.05em]">
                Automation Instructions
              </label>

              <textarea
                id="promptInput"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                placeholder="e.g. Whenever I get an invoice, extract the vendor name, invoice date, due date, invoice number, and total amount with currency."
                className="w-full resize-none text-base sm:text-lg text-[#000000] placeholder:text-[#808080] bg-transparent border-none outline-hidden focus:ring-0 leading-relaxed font-normal"
                autoFocus
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-[#5b6882] text-center sm:text-left">
                No regex, no rules, no complex syntax required.
              </p>

              <button
                type="submit"
                disabled={!prompt.trim()}
                className="surf-btn w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-medium tracking-tight flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next: Choose Destination</span>
                <span className="text-base leading-none">→</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Subtle bottom footer info */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-[#808080]">
        Destination: Google Sheets • AI parses emails and attachments in real time
      </footer>
    </div>
  );
}
