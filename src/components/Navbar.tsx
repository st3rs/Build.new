import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
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
  const [openDropdown, setOpenDropdown] = useState<'solutions' | 'resources' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  function jumpTo(id: string) {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0B]/95 backdrop-blur-xl"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 md:gap-6">
        {/* Zone 1: Mobile Hamburger + Custom Build.new Logo + Primary Nav Links */}
        <div className="flex items-center gap-2.5 sm:gap-8 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={isTh ? 'เปิดเมนูนำทาง' : 'Toggle navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <a href="#top" className="whitespace-nowrap shrink-0 focus:outline-none">
            <BuildLogo />
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label={isTh ? 'เมนูหลัก' : 'Primary Navigation'}
            className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-300"
          >
            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'solutions'}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'solutions' ? null : 'solutions'))
                }
                className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isTh ? 'โซลูชัน' : 'Solutions'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {openDropdown === 'solutions' && (
                <div className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-[#141517] border border-white/10 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.75)] z-50">
                  <button
                    type="button"
                    onClick={() => jumpTo('#templates')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    {isTh ? '10 เทมเพลตพร้อมใช้งาน' : '10 Production Templates'}
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpTo('#scale')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    {isTh ? 'ฐานข้อมูล & โฮสติ้งระดับสเกล' : 'Databases & Edge Hosting'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onEnterWorkspace();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#38BDF8] hover:bg-white/5 cursor-pointer"
                  >
                    {isTh ? 'เปิด AI Builder Workspace' : 'Launch Builder Workspace'}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-expanded={openDropdown === 'resources'}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === 'resources' ? null : 'resources'))
                }
                className="inline-flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isTh ? 'แหล่งเรียนรู้' : 'Resources'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-[#141517] border border-white/10 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.75)] z-50">
                  <button
                    type="button"
                    onClick={() => jumpTo('#agent')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    {isTh ? 'AI Coding Agent v2.0' : 'AI Coding Agent v2.0'}
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpTo('#teams')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/5 cursor-pointer"
                  >
                    {isTh ? 'คู่มือสำหรับทีม & องค์กร' : 'Team & Agency Playbooks'}
                  </button>
                </div>
              )}
            </div>

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
                className="rounded-lg px-2 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0D0E10] px-4 py-3 space-y-1.5">
          <button
            type="button"
            onClick={() => jumpTo('#templates')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {isTh ? '10 เทมเพลตพร้อมใช้งาน' : '10 Project Templates'}
          </button>
          <button
            type="button"
            onClick={() => jumpTo('#agent')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {isTh ? 'AI Coding Agent' : 'AI Coding Agent'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPricing();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {isTh ? 'แพ็กเกจและราคา' : 'Pricing'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onEnterWorkspace();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#00E5FF] hover:bg-white/5 cursor-pointer"
          >
            {isTh ? 'เปิด Workspace →' : 'Open Workspace →'}
          </button>
        </div>
      )}
    </header>
  );
}
