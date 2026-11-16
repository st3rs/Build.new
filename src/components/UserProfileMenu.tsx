import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, RotateCcw, Sparkles } from 'lucide-react';
import type { AuthUser, PlanTier } from '../types/builder';
import { PLAN_MONTHLY_QUOTAS, formatTokenCount } from '../utils/tokenEngine';

interface UserProfileMenuProps {
  user: AuthUser;
  plan: PlanTier;
  credits: number;
  onUpgradePlan: () => void;
  onResetCredits: () => void;
  onSignOut: () => void;
}

export function UserProfileMenu({
  user,
  plan,
  credits,
  onUpgradePlan,
  onResetCredits,
  onSignOut,
}: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const quota = PLAN_MONTHLY_QUOTAS[plan];
  const progressPct = Math.min(100, Math.max(0, Math.round((credits / quota) * 100)));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.email}`}
        className="flex items-center gap-2.5 rounded-full bg-[#161719] hover:bg-[#222326] border border-white/10 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0066FF] shrink-0"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00E5FF] text-xs font-semibold text-white shrink-0">
          {user.initials}
        </span>
        <div className="hidden sm:flex items-center gap-2 text-left">
          <span className="text-xs font-medium text-slate-200 max-w-[160px] truncate">
            {user.email}
          </span>
          <span className="rounded-full bg-[#0066FF]/20 border border-[#0066FF]/40 px-2 py-0.5 text-[10px] font-mono font-medium text-[#B3C5FF] whitespace-nowrap shrink-0">
            {plan}
          </span>
          <span className="hidden xl:inline text-[11px] font-mono text-slate-400 tabular-nums whitespace-nowrap shrink-0">
            {formatTokenCount(credits)}
          </span>
        </div>
        <ChevronDown
          className={`hidden sm:block w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-xl bg-[#141517]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.65)] p-4 z-50"
        >
          <div className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <span className="rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-2 py-0.5 text-[11px] font-mono text-[#BDF4FF]">
                {plan} Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
          </div>

          <div className="py-3 border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Token Balance</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {formatTokenCount(credits)} / {formatTokenCount(quota)} tokens
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#00E5FF] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onUpgradePlan();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#BDF4FF] hover:bg-[#0066FF]/15 transition-colors cursor-pointer text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              Upgrade Plan
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onResetCredits();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset Demo Credits
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
