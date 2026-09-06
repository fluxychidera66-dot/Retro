import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Zap, 
  CreditCard, 
  Download, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { UserAccount } from '../types';

export interface PlanTier {
  id: 'Free Trial' | 'Starter' | 'Pro' | 'Business';
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  limit: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const PLANS: PlanTier[] = [
  {
    id: 'Free Trial',
    name: 'Free Trial',
    monthlyPrice: 0,
    annualPrice: 0,
    limit: 100,
    description: 'Perfect for testing inbox2data with personal receipts.',
    features: [
      '100 email extractions / month',
      '1 active automation',
      'Standard Google Sheets integration',
      'Community support'
    ]
  },
  {
    id: 'Starter',
    name: 'Starter',
    monthlyPrice: 19,
    annualPrice: 15,
    limit: 1000,
    description: 'For freelancers and creators tracking daily business expenses.',
    features: [
      '1,000 email extractions / month',
      '5 active automations',
      'Real-time background push sync',
      'PDF & attachment text parsing',
      'Standard email support'
    ]
  },
  {
    id: 'Pro',
    name: 'Pro',
    badge: 'Most Popular',
    popular: true,
    monthlyPrice: 49,
    annualPrice: 39,
    limit: 5000,
    description: 'For growing teams managing sales leads, orders & vendor invoices.',
    features: [
      '5,000 email extractions / month',
      'Unlimited active automations',
      'Needs Review confidence queue',
      'Multi-sheet & tab auto-routing',
      'Webhook & Slack alerts',
      'Priority support (under 2 hours)'
    ]
  },
  {
    id: 'Business',
    name: 'Business',
    monthlyPrice: 129,
    annualPrice: 99,
    limit: 20000,
    description: 'High-throughput operations with enterprise-grade security.',
    features: [
      '20,000 email extractions / month',
      'Unlimited active automations',
      'Custom regex & AI parsing models',
      'Audit logs & team workspace access',
      'Dedicated onboarding specialist',
      '99.9% uptime SLA guarantee'
    ]
  }
];

interface BillingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdatePlan: (newPlan: 'Free Trial' | 'Starter' | 'Pro' | 'Business', newLimit: number) => void;
  onShowToast: (message: string) => void;
}

export function BillingPlansModal({
  isOpen,
  onClose,
  user,
  onUpdatePlan,
  onShowToast
}: BillingPlansModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'plans' | 'billing'>('plans');
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PlanTier) => {
    if (plan.id === user.plan) return;
    setUpdatingPlanId(plan.id);

    setTimeout(() => {
      onUpdatePlan(plan.id, plan.limit);
      setUpdatingPlanId(null);
      onShowToast(`Successfully switched to the ${plan.name} plan! Your limit is now ${plan.limit.toLocaleString()} extractions/mo.`);
    }, 450);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    onShowToast(`Downloading invoice receipt #${invoiceId} as PDF...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-[#e5e7eb] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#cfe9fd]/60 border border-[#cfe9fd] flex items-center justify-center text-[#006dc8]">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#000000] tracking-tight">
                  Subscription Plans & Billing
                </h2>
                <p className="text-xs text-[#5b6882]">
                  Currently on <span className="font-semibold text-[#000000]">{user.plan}</span> plan ({user.usedEmails.toLocaleString()} / {user.planLimit.toLocaleString()} emails used)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Modal Tabs */}
            <div className="hidden sm:flex bg-[#f3f4f6] p-1 rounded-full border border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  activeTab === 'plans'
                    ? 'bg-white text-[#000000] shadow-2xs'
                    : 'text-[#5b6882] hover:text-[#000000]'
                }`}
              >
                Choose Plan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                  activeTab === 'billing'
                    ? 'bg-white text-[#000000] shadow-2xs'
                    : 'text-[#5b6882] hover:text-[#000000]'
                }`}
              >
                Invoices & Card
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#5b6882] hover:text-[#000000] hover:bg-[#f3f4f6] rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {activeTab === 'plans' ? (
            <>
              {/* Billing Toggle Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-[#000000]">
                    Select the plan that fits your email volume
                  </h3>
                  <p className="text-xs text-[#5b6882] mt-0.5">
                    Upgrade, downgrade, or cancel anytime. Extractions reset on the 1st of every month.
                  </p>
                </div>

                {/* Monthly / Annual Toggle */}
                <div className="inline-flex items-center gap-2 bg-[#f3f4f6] p-1 rounded-full border border-[#e5e7eb]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-[#000000] shadow-2xs font-semibold'
                        : 'text-[#5b6882] hover:text-[#000000]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-white text-[#000000] shadow-2xs font-semibold'
                        : 'text-[#5b6882] hover:text-[#000000]'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = plan.id === user.plan;
                  const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                        plan.popular
                          ? 'border-[#009afc] bg-linear-to-b from-[#cfe9fd]/15 to-white ring-1 ring-[#009afc]'
                          : isCurrent
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1]'
                      }`}
                      style={{
                        boxShadow: plan.popular 
                          ? '0 10px 25px -5px rgba(0, 154, 252, 0.1)' 
                          : 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px'
                      }}
                    >
                      {/* Popular / Current Badge */}
                      {plan.badge && !isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006dc8] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          {plan.badge}
                        </div>
                      )}
                      {isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Active Plan
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-base font-semibold text-[#000000]">{plan.name}</h4>
                        </div>
                        <p className="text-xs text-[#5b6882] min-h-[36px] leading-relaxed mb-4">
                          {plan.description}
                        </p>

                        {/* Price */}
                        <div className="mb-5 pb-4 border-b border-[#f3f4f6]">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-bold text-[#000000]">
                              ${price}
                            </span>
                            <span className="text-xs text-[#5b6882]">
                              / month
                            </span>
                          </div>
                          {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                            <p className="text-[11px] text-[#5b6882] mt-0.5">
                              Billed annually (${price * 12}/yr)
                            </p>
                          )}
                          {plan.monthlyPrice === 0 && (
                            <p className="text-[11px] text-[#5b6882] mt-0.5">
                              Free forever, no credit card
                            </p>
                          )}
                        </div>

                        {/* Features List */}
                        <ul className="space-y-2.5 mb-6 text-xs text-[#5b6882]">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-[#006dc8] mt-0.5 shrink-0" />
                              <span className="leading-tight text-[#374151]">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isCurrent ? (
                          <button
                            type="button"
                            disabled
                            className="w-full py-2.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Current Plan</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingPlanId !== null}
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full py-2.5 rounded-full text-xs font-medium tracking-tight flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              plan.popular
                                ? 'surf-btn shadow-xs'
                                : 'bg-[#f3f4f6] text-[#000000] hover:bg-[#e5e7eb] border border-[#e5e7eb]'
                            }`}
                          >
                            {updatingPlanId === plan.id ? (
                              <span>Updating...</span>
                            ) : (
                              <>
                                <span>{plan.monthlyPrice > (PLANS.find(p => p.id === user.plan)?.monthlyPrice || 0) ? 'Upgrade to ' + plan.name : 'Switch to ' + plan.name}</span>
                                <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Invoices & Card Details Tab */
            <div className="space-y-6">
              {/* Payment Method */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#000000]">Payment Method</h4>
                    <p className="text-xs text-[#5b6882]">Primary card used for monthly subscription billing.</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Default
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-md bg-white border border-[#e5e7eb] flex items-center justify-center shadow-2xs">
                      <CreditCard className="w-4 h-4 text-[#006dc8]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#000000]">Visa ending in 4242</span>
                      <p className="text-[11px] text-[#5b6882]">Expires 08/2028 • Auto-renews</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onShowToast("Stripe card management portal opened in a secure frame.")}
                    className="text-xs font-medium text-[#006dc8] hover:underline cursor-pointer"
                  >
                    Update Card
                  </button>
                </div>
              </div>

              {/* Billing History & Invoices */}
              <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#000000]">Past Invoices & Receipts</h4>
                    <p className="text-xs text-[#5b6882]">Download itemized invoices for your accounting records.</p>
                  </div>
                  <span className="text-xs text-[#5b6882]">Next billing: Oct 01, 2026</span>
                </div>

                <div className="divide-y divide-[#f3f4f6] border border-[#e5e7eb] rounded-xl overflow-hidden">
                  {[
                    { id: 'INV-2026-08', date: 'Aug 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Starter Plan (Monthly)' },
                    { id: 'INV-2026-07', date: 'Jul 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Starter Plan (Monthly)' },
                    { id: 'INV-2026-06', date: 'Jun 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Starter Plan (Monthly)' }
                  ].map((inv) => (
                    <div key={inv.id} className="p-3.5 sm:px-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#9ca3af]" />
                        <div>
                          <p className="text-xs font-semibold text-[#000000]">{inv.id}</p>
                          <p className="text-[11px] text-[#5b6882]">{inv.date} • {inv.plan}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-semibold text-[#000000]">{inv.amount}</span>
                          <span className="block text-[10px] text-emerald-600 font-medium">{inv.status}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(inv.id)}
                          className="p-1.5 text-[#5b6882] hover:text-[#000000] hover:bg-white rounded-lg border border-transparent hover:border-[#e5e7eb] transition-all cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5b6882]">
          <span>Need help choosing? Send questions to <a href="mailto:support@inbox2data.com" className="text-[#006dc8] hover:underline">support@inbox2data.com</a></span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#e5e7eb] bg-white hover:bg-[#f3f4f6] text-[#000000] font-medium transition-colors cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
