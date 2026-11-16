import { ChevronDown } from 'lucide-react';
import type { AuthUser, LanguageCode, PlanTier } from '../types/builder';
import { BuildLogo } from './BuildLogo';
import { CreditBadge } from './CreditBadge';
import { UserProfileMenu } from './UserProfileMenu';

interface NavbarProps {
  user: AuthUser | null;
  plan: PlanTier;
  credits: number;
  lang: LanguageCode;
  onToggleLang: (lang: LanguageCode) => void;
  onOpenAuth: (tab: 'signin' | 'signup') => void;
  onOpenPricing: () => void;
  onResetCredits: () => void;
  onSignOut: () => void;
  onEnterWorkspace: () => void;
}

export function Navbar({
  user,
  plan,
  credits,
  lang,
  onToggleLang,
  onOpenAuth,
  onOpenPricing,
  onResetCredits,
  onSignOut,
  onEnterWorkspace,
}: NavbarProps) {
  const isTh = lang === 'th';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0B]/95 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 md:gap-6">
        {/* Zone 1: Custom Build.new Logo + Primary Nav Links */}
        <div className="flex items-center gap-8 min-w-0">
          <a href="#top" className="whitespace-nowrap shrink-0 focus:outline-none">
            <BuildLogo />
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label={isTh ? 'เมนูหลัก' : 'Primary Navigation'}
            className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-300"
          >
            <a
              href="#templates"
              className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>{isTh ? 'โซลูชัน' : 'Solutions'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href="#agent"
              className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>{isTh ? 'แหล่งเรียนรู้' : 'Resources'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href="#teams"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {isTh ? 'ร่วมงานกับเรา' : 'Careers'}
            </a>
            <button
              type="button"
              onClick={onOpenPricing}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isTh ? 'ราคา' : 'Pricing'}
            </button>
            <button
              type="button"
              onClick={onEnterWorkspace}
              className="hover:text-[#00E5FF] text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Workspace
            </button>
          </nav>
        </div>

        {/* Zone 3: Language Switcher + Live Credit Pill + Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* TH | EN Pill */}
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg bg-[#141517] border border-white/10 p-0.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => onToggleLang('th')}
              aria-pressed={isTh}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isTh ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TH
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              aria-pressed={!isTh}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                !isTh ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {user ? (
            <>
              <CreditBadge credits={credits} onTopUp={onOpenPricing} />
              <UserProfileMenu
                user={user}
                plan={plan}
                credits={credits}
                onUpgradePlan={onOpenPricing}
                onResetCredits={onResetCredits}
                onSignOut={onSignOut}
              />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="rounded-lg px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isTh ? 'เข้าสู่ระบบ' : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="cobalt-cta rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isTh ? 'เริ่มต้นใช้งาน' : 'Get started'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
