import { Check } from 'lucide-react';
import { StepShell, Card } from './StepShell';
import { Field, Select, TextInput } from '../ui/fields';
import { useConfig } from '../../state/ConfigContext';
import { CARBON_PARTS, PAINT_FINISHES, PAINT_SWATCHES } from '../../constants';
import { cn } from '../../lib/utils';

const BUMPER_STYLES = ['Stock', 'Sport', 'Aggressive', 'Aero', 'Widebody-matched'];
const LIP_STYLES = ['None', 'Subtle', 'Splitter', 'Full lip'];
const HOOD_STYLES = ['Stock', 'Vented', 'Carbon', 'Cowl', 'Double-sided'];
const GRILLE_STYLES = ['Stock', 'Mesh', 'Blacked-out', 'Ducted', 'Body-color'];
const LIGHT_STYLES = ['Stock', 'LED', 'Smoked', 'Sequential', 'Clear'];
const WIDEBODY = ['None', 'Fender flares', 'Bolt-on kit', 'Full widebody'];
const SPOILER = ['None', 'Lip spoiler', 'Ducktail', 'GT wing'];
const TINT = ['None', '35%', '20%', '15%', '5% (limo)'];

export function ExteriorStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, updateExterior } = useConfig();
  const e = state.exterior;

  const toggleCarbon = (part: string) => {
    const next = e.carbonAccents.includes(part)
      ? e.carbonAccents.filter((p) => p !== part)
      : [...e.carbonAccents, part];
    updateExterior({ carbonAccents: next });
  };

  return (
    <StepShell
      title="Exterior Preferences"
      description="Dial in body kit, paint, aero, and accents. Everything here flows into your live preview and the AI design brief."
      onBack={onBack}
      onNext={onNext}
    >
      <Card title="Paint & Finish">
        <Field label="Paint Color">
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
            {PAINT_SWATCHES.map((s) => {
              const active = e.paintColor === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => updateExterior({ paintColor: active ? '' : s.name })}
                  className={cn(
                    'group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all',
                    active ? 'border-lime-glow/70 shadow-glow-sm' : 'border-white/10 hover:border-white/30',
                  )}
                  title={s.name}
                >
                  <span
                    className="relative h-10 w-full rounded-lg border border-white/10"
                    style={{ backgroundColor: s.hex }}
                  >
                    {active && (
                      <Check
                        className="absolute inset-0 m-auto h-5 w-5 text-charcoal-950 drop-shadow"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="text-[10px] leading-tight text-gray-400">{s.name}</span>
                </button>
              );
            })}
          </div>
        </Field>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Custom Color" hint="Overrides swatch — name or hex (#RRGGBB)">
            <TextInput
              value={/^#/.test(e.paintColor) || !PAINT_SWATCHES.some((s) => s.name === e.paintColor) ? e.paintColor : ''}
              onChange={(paintColor) => updateExterior({ paintColor })}
              placeholder="e.g. #1d6cf2 or Midnight Teal"
            />
          </Field>
          <Field label="Finish">
            <Select value={e.paintFinish} onChange={(paintFinish) => updateExterior({ paintFinish })} options={PAINT_FINISHES} />
          </Field>
        </div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Body Wrap" hint="Optional — overrides paint look">
            <TextInput value={e.bodyWrap} onChange={(bodyWrap) => updateExterior({ bodyWrap })} placeholder="e.g. Satin Military Green" />
          </Field>
          <Field label="Decals / Racing Livery">
            <TextInput value={e.decals} onChange={(decals) => updateExterior({ decals })} placeholder="e.g. Subtle side stripes" />
          </Field>
        </div>
      </Card>

      <Card title="Body Kit & Aero">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Front Bumper">
            <Select value={e.frontBumper} onChange={(frontBumper) => updateExterior({ frontBumper })} options={BUMPER_STYLES} />
          </Field>
          <Field label="Rear Bumper">
            <Select value={e.rearBumper} onChange={(rearBumper) => updateExterior({ rearBumper })} options={BUMPER_STYLES} />
          </Field>
          <Field label="Front Lip">
            <Select value={e.frontLip} onChange={(frontLip) => updateExterior({ frontLip })} options={LIP_STYLES} />
          </Field>
          <Field label="Rear Diffuser">
            <Select value={e.rearDiffuser} onChange={(rearDiffuser) => updateExterior({ rearDiffuser })} options={['None', 'Subtle', 'Aggressive', 'Carbon']} />
          </Field>
          <Field label="Side Skirts">
            <Select value={e.sideSkirts} onChange={(sideSkirts) => updateExterior({ sideSkirts })} options={['Stock', 'Sport', 'Extended']} />
          </Field>
          <Field label="Widebody / Flares">
            <Select value={e.widebody} onChange={(widebody) => updateExterior({ widebody })} options={WIDEBODY} />
          </Field>
          <Field label="Hood">
            <Select value={e.hood} onChange={(hood) => updateExterior({ hood })} options={HOOD_STYLES} />
          </Field>
          <Field label="Spoiler / Wing">
            <Select value={e.spoiler} onChange={(spoiler) => updateExterior({ spoiler })} options={SPOILER} />
          </Field>
          <Field label="Grille">
            <Select value={e.grille} onChange={(grille) => updateExterior({ grille })} options={GRILLE_STYLES} />
          </Field>
        </div>
      </Card>

      <Card title="Lighting & Glass">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Headlights">
            <Select value={e.headlights} onChange={(headlights) => updateExterior({ headlights })} options={LIGHT_STYLES} />
          </Field>
          <Field label="Taillights">
            <Select value={e.taillights} onChange={(taillights) => updateExterior({ taillights })} options={LIGHT_STYLES} />
          </Field>
          <Field label="Window Tint">
            <Select value={e.windowTint} onChange={(windowTint) => updateExterior({ windowTint })} options={TINT} />
          </Field>
        </div>
      </Card>

      <Card title="Carbon-Fiber Accents">
        <div className="flex flex-wrap gap-2">
          {CARBON_PARTS.map((part) => {
            const active = e.carbonAccents.includes(part);
            return (
              <button
                key={part}
                type="button"
                onClick={() => toggleCarbon(part)}
                className={active ? 'chip-on' : 'chip-off'}
              >
                {active && <Check className="h-3.5 w-3.5" />}
                {part}
              </button>
            );
          })}
        </div>
      </Card>
    </StepShell>
  );
}
