import { Check } from 'lucide-react';
import { STEPS } from '../../constants';
import type { StepId } from '../../types';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  active: StepId;
  completed: Set<StepId>;
  onNavigate: (id: StepId) => void;
}

export function ProgressBar({ active, completed, onNavigate }: ProgressBarProps) {
  const flow = STEPS.filter((s) => s.inFlow);
  const activeIndex = flow.findIndex((s) => s.id === active);
  const pct = activeIndex < 0 ? 0 : (activeIndex / (flow.length - 1)) * 100;

  return (
    <div className="hidden px-6 py-4 md:block">
      <div className="relative">
        <div className="absolute left-0 top-4 h-0.5 w-full bg-charcoal-700" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-lime-glow transition-all duration-500"
          style={{ width: `${Math.max(0, pct)}%` }}
        />
        <ol className="relative flex justify-between">
          {flow.map((step, i) => {
            const isActive = step.id === active;
            const isDone = completed.has(step.id) || i < activeIndex;
            return (
              <li key={step.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onNavigate(step.id)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200',
                    isActive
                      ? 'border-lime-glow bg-lime-glow text-charcoal-950 shadow-glow-sm'
                      : isDone
                        ? 'border-lime-glow/60 bg-charcoal-900 text-lime-soft'
                        : 'border-charcoal-600 bg-charcoal-900 text-gray-500 hover:border-gray-500',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone && !isActive ? <Check className="h-4 w-4" /> : i + 1}
                </button>
                <span
                  className={cn(
                    'mt-2 hidden text-[11px] font-medium lg:block',
                    isActive ? 'text-lime-soft' : 'text-gray-500',
                  )}
                >
                  {step.short}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
