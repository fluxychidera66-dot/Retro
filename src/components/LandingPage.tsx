import React, { useState, useEffect } from 'react';
import { 
  Inbox2DataBrand, 
  GoogleLogo, 
  GmailLogo, 
  GoogleSheetsLogo, 
  StripeLogo 
} from './Logos';
import { 
  ArrowRight, 
  ArrowUp,
  Check, 
  ChevronDown, 
  FileText, 
  Users, 
  ShoppingBag, 
  FileCheck, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  Paperclip, 
  Eye, 
  AlertCircle, 
  Layers, 
  Database,
  RefreshCw
} from 'lucide-react';

interface LandingPageProps {
  onConnectGmail: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

const PROMPT_EXAMPLES = [
  {
    category: "Shopify Orders",
    prompt: "Extract customer name, email address, order #, items purchased, and total amount paid from every Shopify order confirmation email."
  },
  {
    category: "Invoices & Receipts",
    prompt: "Whenever I get an invoice or receipt email, extract the vendor name, invoice date, due date, invoice number, and total amount."
  },
  {
    category: "Website Leads",
    prompt: "Capture full name, company, business email, project budget, and message summary from incoming website contact form leads."
  },
  {
    category: "Job Applications",
    prompt: "Extract applicant full name, email address, years of experience, current role, and portfolio link from candidate resume emails."
  },
  {
    category: "Supplier POs",
    prompt: "Log supplier name, purchase order number, delivery date, item quantities, and net payment terms from vendor PO emails."
  }
];

export function LandingPage({ onConnectGmail, onOpenTerms, onOpenPrivacy }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Prompt Animation State
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Typewriter Animation Loop for the 5 Prompts
  useEffect(() => {
    if (isUserEditing) return;

    const currentFullText = PROMPT_EXAMPLES[activePromptIndex].prompt;
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 32);
      } else {
        // Pause at complete text before starting to delete
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 3800);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 14);
      } else {
        setIsDeleting(false);
        setActivePromptIndex((prev) => (prev + 1) % PROMPT_EXAMPLES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, activePromptIndex, isUserEditing]);

  const effectivePrompt = isUserEditing ? customPrompt : displayedText;

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectGmail();
  };

  const faqs = [
    {
      q: "Is my email data safe?",
      a: "Yes. inbox2data requests read-only OAuth access strictly to match incoming emails for your automations. We never sell your data, never train public models on your confidential emails, and all processing is encrypted in transit and at rest."
    },
    {
      q: "What happens if the AI extracts something wrong?",
      a: "inbox2data computes a confidence score for every extracted field. If confidence is below our strict threshold (e.g. conflicting totals on an invoice), the record is safely held in your 'Needs Review' queue instead of guessing blindly."
    },
    {
      q: "Can I use my existing Google Sheet?",
      a: "Yes. You can either let inbox2data automatically generate a pristine new Google Sheet with matched column headers, or choose any existing Google Sheet in your Google Drive."
    },
    {
      q: "What email providers do you support?",
      a: "Currently inbox2data supports Gmail and Google Workspace accounts natively via official Google OAuth. Support for Outlook and IMAP is planned for subsequent releases."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel or switch plans anytime from the Settings & Billing page with a single click. No lock-in, no hidden contracts."
    },
    {
      q: "Do you support attachments like PDFs?",
      a: "Yes. inbox2data's AI engine natively inspects PDF attachments, invoices, images, and shipping receipts alongside the email body text."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#000000]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] px-6 h-16 flex items-center justify-between">
        <Inbox2DataBrand size="default" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5b6882]">
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="hover:text-[#000000] transition-colors"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection('use-cases')} 
            className="hover:text-[#000000] transition-colors"
          >
            Use cases
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="hover:text-[#000000] transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="hover:text-[#000000] transition-colors"
          >
            FAQ
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onConnectGmail()}
            className="text-xs font-medium text-[#5b6882] hover:text-[#000000] px-3.5 py-2 rounded-full hover:bg-[#f3f4f6] transition-colors hidden sm:block cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => onConnectGmail()}
            className="surf-btn px-5 py-2 rounded-full text-xs font-medium tracking-tight flex items-center gap-2 cursor-pointer"
          >
            <GoogleLogo className="w-3.5 h-3.5" />
            <span>Connect Gmail</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 px-6 sky-gradient-hero">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl text-[#000000] font-normal tracking-tight leading-[1.08]">
            Turn your inbox into a spreadsheet — automatically.
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg text-[#5b6882] max-w-2xl mx-auto leading-relaxed font-normal">
            Connect Gmail, describe what data you want in plain English, and watch it show up in Google Sheets — no rules, no regex, no setup.
          </p>

          {/* THE OPENAI-STYLE RECTANGULAR QUERY BOX WITH ANIMATED PROMPTS */}
          <div className="pt-6 max-w-3xl lg:max-w-4xl mx-auto w-full">
            <form
              onSubmit={handleHeroSubmit}
              className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-7 text-left flex flex-col justify-between min-h-[260px] sm:min-h-[280px] relative focus-within:border-[#009afc] focus-within:ring-4 focus-within:ring-[#cfe9fd]/30 transition-all"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 8px 28px 0px"
              }}
            >
              {/* Box Top Header: Source to Destination */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f9fafb] text-xs font-medium text-[#5b6882] shrink-0 border border-[#e5e7eb]">
                  <GmailLogo className="w-3.5 h-3.5" />
                  <span className="text-[#808080] text-[11px]">→</span>
                  <GoogleSheetsLogo className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-[#000000] font-medium">Automatic extraction</span>
                </div>
              </div>

              {/* Main Center Area: Large Animated Query / Textarea */}
              <div className="py-4 my-auto relative">
                {isUserEditing ? (
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    placeholder="Describe what data to extract in plain English..."
                    className="w-full text-lg sm:text-2xl font-normal text-[#000000] leading-relaxed bg-transparent border-none outline-hidden resize-none placeholder:text-[#808080]"
                    autoFocus
                  />
                ) : (
                  <div 
                    onClick={() => {
                      setIsUserEditing(true);
                      setCustomPrompt(displayedText);
                    }}
                    className="text-lg sm:text-2xl font-normal text-[#000000] leading-relaxed cursor-text min-h-[96px] flex items-center"
                  >
                    <span>"{displayedText}"</span>
                    <span className="inline-block w-0.5 h-6 bg-[#000000] ml-1 animate-pulse align-middle" />
                  </div>
                )}
              </div>

              {/* Box Bottom Area: OpenAI-Style Action Row */}
              <div className="pt-3 border-t border-[#f3f4f6] flex items-center justify-between">
                <div>
                  {isUserEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserEditing(false);
                        setCustomPrompt("");
                      }}
                      className="text-xs text-[#5b6882] hover:text-[#000000] hover:underline cursor-pointer"
                    >
                      Reset prompt
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#000000] hover:bg-[#222222] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Connect Google Account"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>

          {/* LARGE CENTERED CONNECT GMAIL BUTTON */}
          <div className="pt-6 flex flex-col items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onConnectGmail()}
              className="surf-btn w-full sm:w-auto min-w-[320px] sm:min-w-[380px] px-10 py-4.5 rounded-full text-base sm:text-lg font-semibold tracking-tight flex items-center justify-center gap-3.5 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all mx-auto"
            >
              <GoogleLogo className="w-5 h-5 shrink-0" />
              <span>Connect Gmail</span>
            </button>

            <div className="text-xs text-[#5b6882] flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-1">
              <span>✓ 14-day free trial</span>
              <span>•</span>
              <span>✓ No credit card required</span>
              <span>•</span>
              <span>✓ Google Verified OAuth</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-tight mt-2">
            How inbox2data turns email into data
          </h2>
          <p className="text-sm sm:text-base text-[#5b6882] mt-2 max-w-xl mx-auto">
            No brittle parsing engines, no complex coding. Connect once and let natural language take care of the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#009afc] font-semibold mb-3">01</div>
              <h3 className="text-base font-semibold text-[#000000] mb-2">Connect your inbox</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                Securely link your Gmail account in one click using standard Google OAuth authorization.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f3f4f6] flex items-center gap-2 text-xs text-[#5b6882]">
              <GmailLogo className="w-3.5 h-3.5" />
              <span>1-click grant</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#009afc] font-semibold mb-3">02</div>
              <h3 className="text-base font-semibold text-[#000000] mb-2">Describe what you want</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                Type a plain-English instruction like "Whenever I get an invoice, extract vendor, amount, and due date."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f3f4f6] flex items-center gap-2 text-xs text-[#5b6882]">
              <Sparkles className="w-3.5 h-3.5 text-[#009afc]" />
              <span>Zero regex rules</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#009afc] font-semibold mb-3">03</div>
              <h3 className="text-base font-semibold text-[#000000] mb-2">Watch it work</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                New matching emails and attached receipts are parsed in real time and appended to your Google Sheet.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f3f4f6] flex items-center gap-2 text-xs text-[#5b6882]">
              <GoogleSheetsLogo className="w-3.5 h-3.5" />
              <span>Live sheet sync</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#009afc] font-semibold mb-3">04</div>
              <h3 className="text-base font-semibold text-[#000000] mb-2">Review when unsure</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                If the AI isn't completely confident about an extraction, it flags it for your quick review instead of guessing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f3f4f6] flex items-center gap-2 text-xs text-[#5b6882]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero silent errors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-6 bg-white border-y border-[#e5e7eb]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
              Adaptable Across Teams
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-tight mt-2">
              Automate any email workflow
            </h2>
            <p className="text-sm sm:text-base text-[#5b6882] mt-2 max-w-xl mx-auto">
              If information arrives in an email or attached file, inbox2data can structure it into clean spreadsheet columns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Invoices & Receipts</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "Extract vendor, amount, invoice number, and due date from every billing notification."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Website Leads</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "Capture full name, company, email, and inquiry details from website contact forms."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Orders & Confirmations</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "Log order confirmations with product SKU, quantity, order total, and tracking number."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Purchase Orders</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "Pull PO number, line items, supplier name, and delivery date from procurement messages."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Candidate Resumes</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "Extract candidate name, years of experience, primary role, and contact email from applicants."
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white hover:border-[#009afc]/50 transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#009afc] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#000000] mb-1">Anything Else</h3>
              <p className="text-xs text-[#5b6882] leading-relaxed">
                "If it arrives by email, you can automate it. Describe your custom fields and inbox2data adapts."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
            Built for Precision
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-tight mt-2">
            Why teams choose inbox2data
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">No rules to configure</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Plain English replaces fragile regex expressions and complicated custom parsers forever.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <Paperclip className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">Works with attachments</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Extracts data seamlessly from attached PDF receipts, invoices, and purchase orders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">Test before you trust</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Preview extractions on your real past emails before switching any live automation on.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">Confidence flagging</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Uncertain fields are safely queued for your 1-click review rather than guessing silently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <GoogleSheetsLogo className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">Google Sheets native</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Data lands straight into your spreadsheets. No proprietary databases or lock-in.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#cfe9fd]/40 text-[#006dc8] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-[#000000]">Enterprise-grade privacy</h3>
            <p className="text-xs text-[#5b6882] leading-relaxed">
              Official Google API verification compliance with strict isolated encryption and read scopes.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: Old way vs inbox2data */}
      <section className="py-20 px-6 bg-white border-y border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
              The Shift
            </span>
            <h2 className="text-3xl font-normal text-[#000000] tracking-tight mt-2">
              Traditional email parsers vs. inbox2data
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f9fafb] p-6 rounded-2xl border border-[#e5e7eb] space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#808080]">
                Traditional Parsers (Old Way)
              </div>
              <ul className="space-y-3 text-xs text-[#5b6882]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Requires writing complex regular expressions (regex)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Breaks immediately whenever a vendor changes their email template</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Separate tool setups for email bodies vs PDF attachments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Silently populates empty or garbled data on format mismatches</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#cfe9fd]/15 p-6 rounded-2xl border border-[#009afc]/30 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#006dc8]">
                inbox2data Way
              </div>
              <ul className="space-y-3 text-xs text-[#000000]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Describe what you want once in natural plain English</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>AI naturally adapts when layouts or receipt structures shift</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Unified extraction across message text and PDF attachments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automated confidence scoring flags questionable items for review</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-tight mt-2">
            Simple, predictable volume tiers
          </h2>
          <p className="text-sm text-[#5b6882] mt-2">
            Start with a 14-day free trial. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Trial */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#000000]">Free Trial</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#000000]">$0</span>
                <span className="text-xs text-[#5b6882]">/ 14 days</span>
              </div>
              <div className="text-xs text-[#5b6882]">100 emails included</div>
              <ul className="space-y-2 text-xs text-[#5b6882] pt-2 border-t border-[#f3f4f6]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1 active automation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Sheets sync</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Needs review queue</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onConnectGmail()}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors cursor-pointer"
            >
              Start Free Trial
            </button>
          </div>

          {/* Starter */}
          <div className="bg-white p-6 rounded-2xl border border-[#009afc] shadow-sm relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#009afc] text-white text-[10px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#000000]">Starter</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#000000]">$19</span>
                <span className="text-xs text-[#5b6882]">/ month</span>
              </div>
              <div className="text-xs text-[#006dc8] font-medium">1,000 emails / month</div>
              <ul className="space-y-2 text-xs text-[#5b6882] pt-2 border-t border-[#f3f4f6]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5 active automations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Attachment extraction</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-time webhook sync</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onConnectGmail()}
              className="surf-btn mt-6 w-full py-2.5 rounded-full text-xs font-medium cursor-pointer"
            >
              Choose Starter
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#000000]">Pro</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#000000]">$49</span>
                <span className="text-xs text-[#5b6882]">/ month</span>
              </div>
              <div className="text-xs text-[#5b6882]">5,000 emails / month</div>
              <ul className="space-y-2 text-xs text-[#5b6882] pt-2 border-t border-[#f3f4f6]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlimited automations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Priority AI processing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom sheet schema mapping</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onConnectGmail()}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors cursor-pointer"
            >
              Choose Pro
            </button>
          </div>

          {/* Business */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#000000]">Business</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#000000]">$129</span>
                <span className="text-xs text-[#5b6882]">/ month</span>
              </div>
              <div className="text-xs text-[#5b6882]">20,000 emails / month</div>
              <ul className="space-y-2 text-xs text-[#5b6882] pt-2 border-t border-[#f3f4f6]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Multi-user team inbox</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom retention policy</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dedicated support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onConnectGmail()}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium border border-[#e5e7eb] hover:border-[#000000] text-[#000000] transition-colors cursor-pointer"
            >
              Choose Business
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.05em] font-medium text-[#006dc8]">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-normal text-[#000000] tracking-tight mt-2">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-medium text-sm text-[#000000] hover:text-[#006dc8] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#808080] transition-transform duration-200 shrink-0 ${
                    openFaq === index ? "rotate-180 text-[#009afc]" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#5b6882] leading-relaxed border-t border-[#f3f4f6]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-6 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-tight">
            Stop copy-pasting email data manually.
          </h2>
          <p className="text-sm sm:text-base text-[#5b6882] max-w-lg mx-auto">
            Connect your Gmail account, describe your columns in plain English, and watch rows append to Google Sheets in seconds.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onConnectGmail()}
              className="surf-btn px-8 py-3.5 rounded-full text-sm font-medium tracking-tight inline-flex items-center gap-2 cursor-pointer"
            >
              <GoogleLogo className="w-4 h-4" />
              <span>Connect Gmail</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f9fafb] border-t border-[#e5e7eb] py-12 px-6 text-xs text-[#5b6882]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-2">
            <Inbox2DataBrand size="sm" />
            <p className="text-[#808080] text-[11px] leading-relaxed">
              AI email to Google Sheets automation. Connect Gmail, describe what you need in plain English, and append structured spreadsheet rows.
            </p>
          </div>

          <div>
            <div className="font-semibold text-[#000000] mb-2.5">Product</div>
            <ul className="space-y-2 text-[#5b6882]">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#000000]">How it works</button></li>
              <li><button onClick={() => scrollToSection('use-cases')} className="hover:text-[#000000]">Use cases</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#000000]">Pricing</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-[#000000]">FAQ</button></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[#000000] mb-2.5">Company</div>
            <ul className="space-y-2 text-[#5b6882]">
              <li><span className="hover:text-[#000000] cursor-pointer">About inbox2data</span></li>
              <li><span className="hover:text-[#000000] cursor-pointer">Contact Support</span></li>
              <li><span className="hover:text-[#000000] cursor-pointer">Security Overview</span></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-[#000000] mb-2.5">Legal</div>
            <ul className="space-y-2 text-[#5b6882]">
              <li><button onClick={onOpenPrivacy} className="hover:text-[#000000]">Privacy Policy</button></li>
              <li><button onClick={onOpenTerms} className="hover:text-[#000000]">Terms of Service</button></li>
              <li><span className="text-[#808080]">Google API Disclosure</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#808080]">
          <div>© 2026 inbox2data, Inc. All rights reserved.</div>
          <div>Gmail and Google Sheets are trademarks of Google LLC.</div>
        </div>
      </footer>
    </div>
  );
}
