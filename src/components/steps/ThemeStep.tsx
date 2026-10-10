import { Check, Star } from 'lucide-react';
import { StepShell } from './StepShell';
import { THEMES } from '../../constants';
import { useConfig } from '../../state/ConfigContext';
import type { ModificationTheme } from '../../types';
import { cn } from '../../lib/utils';

export function ThemeStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, updateTheme } = useConfig();
  const { primary, secondary } = state.theme;

  const selectPrimary = (id: ModificationTheme) => {
    if (primary === id) {
      updateTheme({ primary: '' });
      return;
    }
    // If the newly-chosen primary was a secondary, remove it from secondary.
    updateTheme({ primary: id, secondary: secondary.filter((s) => s !== id) });
  };

  const toggleSecondary = (id: ModificationTheme) => {
    if (id === primary) return;
    const next = secondary.includes(id)
      ? secondary.filter((s) => s !== id)
      : [...secondary, id].slice(0, 2); // cap secondary themes at 2
    updateTheme({ secondary: next });
  };

  return (
    <StepShell
      title="Modification Theme"
      description="Pick one primary direction, then optionally add up to two complementary themes. Click a card to set it as primary; use “+ secondary” to blend styles."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!primary}
      nextLabel={primary ? 'Next' : 'Choose a primary theme'}
    >
      {primary && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-lime-glow/20 bg-lime-glow/5 px-4 py-3">
          <span className="text-sm text-gray-400">Selected:</span>
          <span className="pill bg-lime-glow/20 text-lime-soft">
            <Star className="h-3 w-3" /> {primary}
          </span>
          {secondary.map((s) => (
            <span key={s} className="pill border border-white/10 bg-white/5 text-gray-300">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => {
          const isPrimary = primary === theme.id;
          const isSecondary = secondary.includes(theme.id);
          return (
            <div
              key={theme.id}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br transition-all duration-200',
                theme.accent,
                'to-charcoal-900',
                isPrimary
                  ? 'border-lime-glow/70 shadow-glow-sm'
                  : isSecondary
                    ? 'border-lime-glow/30'
                    : 'border-white/10 hover:border-lime-glow/40',
              )}
            >
              <button
                type="button"
                onClick={() => selectPrimary(theme.id)}
                className="flex flex-1 flex-col p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-white">{theme.id}</h3>
                  {isPrimary && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-glow text-charcoal-950">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{theme.description}</p>
              </button>
              <div className="flex items-center justify-between border-t border-white/5 px-5 py-2.5">
                <span className="text-[11px] uppercase tracking-wide text-gray-500">
                  {isPrimary ? 'Primary' : isSecondary ? 'Secondary' : 'Tap to set primary'}
                </span>
                <button
                  type="button"
                  disabled={isPrimary}
                  onClick={() => toggleSecondary(theme.id)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-30',
                    isSecondary
                      ? 'bg-lime-glow/20 text-lime-soft'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200',
                  )}
                >
                  {isSecondary ? '− secondary' : '+ secondary'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
