import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, Loader2, X } from 'lucide-react';
import type { BillingCycle, PlanTier } from '../types/builder';
import { getPlanPrice } from '../utils/tokenEngine';

interface PricingModalProps {
  isOpen: boolean;
  currentPlan: PlanTier;
  insufficientAlert: boolean;
  onClose: () => void;
  onUpgrade: (targetPlan: Exclude<PlanTier, 'Free'>) => void;
}

export function PricingModal({
  isOpen,
  currentPlan,
  insufficientAlert,
  onClose,
  onUpgrade,
}: PricingModalProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [processingPlan, setProcessingPlan] = useState<'Pro' | 'Teams' | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProcessingPlan(null);
      return;
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !processingPlan) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, processingPlan, onClose]);

  if (!isOpen) return null;

  function handleSelectUpgrade(target: 'Pro' | 'Teams') {
    if (processingPlan) return;
    setProcessingPlan(target);
    window.setTimeout(() => {
      onUpgrade(target);
      setProcessingPlan(null);
      onClose();
    }, 1500);
  }

  const proPrice = getPlanPrice('Pro', billing);
  const teamsPrice = getPlanPrice('Teams', billing);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-modal-title"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#141517]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden my-auto">
        <div
          className="h-[2px] w-full bg-gradient-to-r from-[#0066FF] via-[#38BDF8] to-[#0066FF]"
          aria-hidden="true"
        />

        <div className="p-6 sm:p-8">
          {/* Insufficient Credits Alert Banner */}
          {insufficientAlert && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-400/35 px-4 py-3 text-sm text-amber-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You&apos;re out of free build tokens. Upgrade your plan to continue building.</span>
            </div>
          )}

          {/* Header & Billing Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 id="pricing-modal-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Scale your ideas with Build.new
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Flexible token allowances for solo builders, production apps, and engineering teams.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="inline-flex items-center p-1 rounded-xl bg-[#0D0E10] border border-white/10">
                <button
                  type="button"
                  onClick={() => setBilling('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    billing === 'monthly'
                      ? 'bg-[#26282B] text-white border border-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling('yearly')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    billing === 'yearly'
                      ? 'bg-[#26282B] text-white border border-white/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yearly
                  <span className="rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-2 py-0.5 text-[10px] font-mono text-[#38BDF8]">
                    Save 20%
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={Boolean(processingPlan)}
                aria-label="Close pricing modal"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3-Column Tier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Free Tier */}
            <section className="flex flex-col justify-between rounded-2xl bg-[#1A1B1E] border border-white/10 p-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Free</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tabular-nums">$0</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Explore AI prototyping and browser builds.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-mono text-slate-200">50,000 tokens / month</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Public projects only</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Standard AI model (Build AI Fast)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Community support</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled
                className="mt-7 w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-400 cursor-not-allowed"
              >
                {currentPlan === 'Free' ? 'Current Plan' : 'Included Base Tier'}
              </button>
            </section>

            {/* Pro Tier */}
            <section className="relative flex flex-col justify-between rounded-2xl bg-[#1E2025] border-2 border-[#38BDF8] p-6 shadow-[0_0_32px_rgba(56,189,248,0.16)]">
              <span className="absolute -top-3 right-5 rounded-full bg-[#38BDF8] px-3 py-0.5 text-[10px] font-mono font-bold tracking-wider text-[#0A0A0B]">
                MOST POPULAR
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Pro</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tabular-nums">${proPrice}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  For builders shipping production web apps.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span className="font-mono text-white">2,000,000 tokens / month</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Private projects &amp; GitHub sync</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Access to Build AI Pro &amp; Claude / Gemini Pro routing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Custom domains &amp; 1-click Edge Deploy</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled={Boolean(processingPlan)}
                onClick={() => handleSelectUpgrade('Pro')}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 cobalt-cta rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-70"
              >
                {processingPlan === 'Pro' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Upgrade...
                  </>
                ) : (
                  <>
                    Upgrade to Pro
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </section>

            {/* Teams Tier */}
            <section className="flex flex-col justify-between rounded-2xl bg-[#1A1B1E] border border-white/10 p-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Teams</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tabular-nums">${teamsPrice}</span>
                  <span className="text-xs text-slate-400">/user/mo</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Collaborative AI software canvas for orgs.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span className="font-mono text-slate-100">10,000,000 shared tokens / month</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Real-time collaborative workspace</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Role-based access &amp; SSO</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>Priority dedicated GPU sandbox</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled={Boolean(processingPlan)}
                onClick={() => handleSelectUpgrade('Teams')}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-70"
              >
                {processingPlan === 'Teams' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Provisioning Team Trial...
                  </>
                ) : (
                  'Start Team Trial'
                )}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
