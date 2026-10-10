import { useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { STEPS } from '../../constants';
import type { StepId } from '../../types';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../lib/utils';

interface SidebarProps {
  active: StepId;
  onNavigate: (id: StepId) => void;
  completed: Set<StepId>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ active, onNavigate, completed, mobileOpen, onCloseMobile }: SidebarProps) {
  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseMobile();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-charcoal-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-glow text-charcoal-950 shadow-glow-sm">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-white">Automotive AI</p>
              <p className="text-[11px] text-gray-500">Visualizer Studio</p>
            </div>
          </div>
          <button className="btn-ghost p-1.5 lg:hidden" onClick={onCloseMobile} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Workflow steps">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = active === step.id;
            const isDone = completed.has(step.id);
            const flowNumber = step.inFlow ? STEPS.slice(0, index + 1).filter((s) => s.inFlow).length : null;
            return (
              <Tooltip key={step.id} label={step.tooltip} side="right">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(step.id);
                    onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150',
                    isActive
                      ? 'border border-lime-glow/40 bg-lime-glow/10 text-white shadow-glow-sm'
                      : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-100',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-lime-glow text-charcoal-950'
                        : isDone
                          ? 'bg-lime-glow/15 text-lime-soft'
                          : 'bg-charcoal-800 text-gray-500 group-hover:text-gray-300',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 truncate">{step.label}</span>
                  {flowNumber !== null && (
                    <span
                      className={cn(
                        'text-[11px] font-semibold tabular-nums',
                        isActive ? 'text-lime-glow' : 'text-gray-600',
                      )}
                    >
                      {String(flowNumber).padStart(2, '0')}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-5 py-4">
          <p className="text-[11px] leading-relaxed text-gray-600">
            AI results are visual concepts, not verified specifications. Always confirm fitment and
            legality with a professional.
          </p>
        </div>
      </aside>
    </>
  );
}
