import { Zap, Plus } from 'lucide-react';
import { formatTokenCount } from '../utils/tokenEngine';

interface CreditBadgeProps {
  credits: number;
  onTopUp: () => void;
}

export function CreditBadge({ credits, onTopUp }: CreditBadgeProps) {
  const isLow = credits < 5000;

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#161719] border border-white/10 pl-2 sm:pl-3 pr-1 sm:pr-1.5 py-1 shadow-[0_0_20px_rgba(0,229,255,0.06)]"
      data-testid="credit-badge"
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
          isLow
            ? 'bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.35)]'
            : 'bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
        }`}
        aria-hidden="true"
      >
        <Zap className="w-3 h-3 fill-current" />
      </span>
      <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-100 tabular-nums whitespace-nowrap">
        {formatTokenCount(credits)}<span className="hidden sm:inline"> tokens left</span>
      </span>
      <button
        type="button"
        onClick={onTopUp}
        className="inline-flex items-center gap-1 rounded-full bg-[#0066FF]/20 hover:bg-[#0066FF]/35 border border-[#0066FF]/40 px-2 sm:px-2.5 py-1 text-[11px] font-medium text-[#BDF4FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
      >
        <Plus className="w-3 h-3" aria-hidden="true" />
        Top Up
      </button>
    </div>
  );
}
