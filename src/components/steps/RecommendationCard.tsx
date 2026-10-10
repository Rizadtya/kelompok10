import { ShieldAlert } from 'lucide-react';
import type { Priority, RecommendationItem } from '../../types';
import { cn } from '../../lib/utils';

const PRIORITY_STYLES: Record<Priority, string> = {
  Essential: 'bg-lime-glow/20 text-lime-soft',
  Recommended: 'bg-sky-500/20 text-sky-300',
  Optional: 'bg-white/10 text-gray-400',
};

export function RecommendationCard({ item }: { item: RecommendationItem }) {
  return (
    <div className="glass-panel flex flex-col gap-2 p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-gray-500">{item.category}</p>
          <h4 className="font-display text-base font-semibold text-white">{item.title}</h4>
        </div>
        <span className={cn('pill flex-shrink-0', PRIORITY_STYLES[item.priority])}>{item.priority}</span>
      </div>
      <p className="text-sm leading-relaxed text-gray-400">{item.rationale}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {item.costEstimate ? (
          <span className="pill border border-white/10 bg-white/[0.03] text-gray-300">
            Est. {item.costEstimate}
          </span>
        ) : (
          <span className="pill border border-white/10 bg-white/[0.03] text-gray-500">
            Pricing varies by region
          </span>
        )}
      </div>
      {item.safetyNote && (
        <p className="mt-1 flex items-start gap-1.5 text-xs text-amber-200/90">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
          {item.safetyNote}
        </p>
      )}
    </div>
  );
}
