import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: 'right' | 'top' | 'bottom';
}

/** Lightweight CSS tooltip (no external dependency). */
export function Tooltip({ label, children, side = 'right' }: TooltipProps) {
  const pos =
    side === 'right'
      ? 'left-full top-1/2 ml-2 -translate-y-1/2'
      : side === 'top'
        ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
        : 'top-full left-1/2 mt-2 -translate-x-1/2';

  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-white/10 bg-charcoal-800 px-2.5 py-1 text-xs font-medium text-gray-100 opacity-0 shadow-panel transition-opacity duration-150 group-hover/tooltip:opacity-100 ${pos}`}
      >
        {label}
      </span>
    </span>
  );
}
