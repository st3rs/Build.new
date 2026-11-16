interface BuildLogoProps {
  size?: 'md' | 'sm';
}

export function BuildLogo({ size = 'md' }: BuildLogoProps) {
  const iconBox = size === 'sm' ? 'w-6 h-6 rounded-md' : 'w-7 h-7 rounded-lg';
  const textSize = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 select-none">
      <span
        className={`inline-flex items-center justify-center ${iconBox} bg-[#16181C] border border-white/15 shadow-[0_0_14px_rgba(0,229,255,0.18)]`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <path
            d="M7.5 8.5L4.5 12L7.5 15.5"
            stroke="#00E5FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 8.5L19.5 12L16.5 15.5"
            stroke="#3875F6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 7L10.5 17"
            stroke="#F1F3F4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={`${textSize} font-bold tracking-tight`}>
        <span className="text-white">Build</span>
        <span className="text-[#3875F6]">.new</span>
      </span>
    </span>
  );
}
