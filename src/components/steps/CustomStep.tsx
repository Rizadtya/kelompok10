import { StepShell, Card } from './StepShell';
import { Field, RangeSlider, Select, TextArea, TextInput } from '../ui/fields';
import { useConfig } from '../../state/ConfigContext';
import { INTENDED_USES } from '../../constants';
import type { IntendedUse } from '../../types';
import { cn } from '../../lib/utils';

const PLACEHOLDER =
  'Create a clean JDM-inspired street build with bronze wheels, a subtle front lip, lowered suspension, and a pearl white finish. Keep the original body proportions recognizable.';

const BUDGETS = ['Under $2k', '$2k–$5k', '$5k–$10k', '$10k–$20k', '$20k+', 'No limit'];

export function CustomStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, updatePreferences } = useConfig();
  const p = state.preferences;

  return (
    <StepShell
      title="Custom Requests and Details"
      description="Describe the result you want in your own words, then set a few preferences to steer the AI."
      onBack={onBack}
      onNext={onNext}
      nextLabel="Run AI Analysis"
    >
      <Card title="Your Vision">
        <Field label="Describe your desired result" hint="The more specific, the better the concept.">
          <TextArea
            value={p.customRequest}
            onChange={(customRequest) => updatePreferences({ customRequest })}
            placeholder={PLACEHOLDER}
            rows={5}
          />
        </Field>
      </Card>

      <Card title="Intended Use">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {INTENDED_USES.map((u) => {
            const active = p.intendedUse === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => updatePreferences({ intendedUse: u.id as IntendedUse })}
                className={cn(
                  'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                  active ? 'border-lime-glow/70 bg-lime-glow/10 shadow-glow-sm' : 'border-white/10 bg-white/[0.02] hover:border-lime-glow/40',
                )}
              >
                <span className={cn('font-display text-sm font-bold', active ? 'text-lime-soft' : 'text-white')}>
                  {u.id}
                </span>
                <span className="mt-1 text-[11px] leading-tight text-gray-500">{u.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Preferences">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Budget Range" hint="Used only to prioritize suggestions, not to quote exact prices.">
            <Select value={p.budgetRange} onChange={(budgetRange) => updatePreferences({ budgetRange })} options={BUDGETS} />
          </Field>
          <div />
          <Field label={`Modification Complexity — ${p.complexity}/5`}>
            <RangeSlider
              value={p.complexity}
              onChange={(complexity) => updatePreferences({ complexity })}
              labels={['Mild', 'Full build']}
            />
          </Field>
          <Field label={`Visual Realism — ${p.realism}/5`}>
            <RangeSlider
              value={p.realism}
              onChange={(realism) => updatePreferences({ realism })}
              labels={['Stylized', 'Photoreal']}
            />
          </Field>
        </div>
      </Card>

      <Card title="Guardrails">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Must-keep original features">
            <TextInput
              value={p.mustKeep}
              onChange={(mustKeep) => updatePreferences({ mustKeep })}
              placeholder="e.g. Original paint color, factory wheels"
            />
          </Field>
          <Field label="Features to avoid">
            <TextInput
              value={p.avoid}
              onChange={(avoid) => updatePreferences({ avoid })}
              placeholder="e.g. No large wing, no stretched tires"
            />
          </Field>
        </div>
      </Card>
    </StepShell>
  );
}
