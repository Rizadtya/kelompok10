import { AlertTriangle, Check } from 'lucide-react';
import { StepShell, Card } from './StepShell';
import { Field, Select, TextInput } from '../ui/fields';
import { useConfig } from '../../state/ConfigContext';
import {
  CALIPER_COLORS,
  FITMENTS,
  SUSPENSION_TYPES,
  WHEEL_DIAMETERS,
  WHEEL_FINISHES,
  WHEEL_PRESETS,
} from '../../constants';
import { cn } from '../../lib/utils';

/** Heuristic warnings for configurations that may compromise safety/legality. */
function buildWarnings(w: {
  rideHeight: string;
  fitment: string;
  camber: string;
  tireProfile: string;
}): string[] {
  const out: string[] = [];
  if (/slammed|low/i.test(w.rideHeight)) {
    out.push('Very low ride height can reduce ground clearance and may rub over bumps or driveways.');
  }
  if (/poke|aggressive/i.test(w.fitment)) {
    out.push('Aggressive (poke) fitment may extend beyond the fender — check local road-legality rules.');
  }
  if (/heavy|aggressive/i.test(w.camber)) {
    out.push('Heavy negative camber accelerates inner tire wear and can reduce braking grip.');
  }
  if (/stretched/i.test(w.tireProfile)) {
    out.push('Stretched tires reduce sidewall protection and may affect handling and legality in some regions.');
  }
  return out;
}

export function WheelsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, updateWheels } = useConfig();
  const w = state.wheels;

  const applyPreset = (key: string) => {
    const preset = WHEEL_PRESETS[key];
    if (!preset) return;
    updateWheels({ preset: key, ...preset.values });
  };

  const warnings = buildWarnings(w);

  return (
    <StepShell
      title="Wheels and Suspension"
      description="Start from a preset, then fine-tune. We flag configurations that may compromise clearance, handling, braking, or road legality."
      onBack={onBack}
      onNext={onNext}
    >
      <Card title="Presets">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(WHEEL_PRESETS).map(([key, preset]) => {
            const active = w.preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={cn(
                  'flex flex-col rounded-xl border p-4 text-left transition-all',
                  active
                    ? 'border-lime-glow/70 bg-lime-glow/10 shadow-glow-sm'
                    : 'border-white/10 bg-white/[0.02] hover:border-lime-glow/40',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-white">{preset.label}</span>
                  {active && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-glow text-charcoal-950">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="mt-1.5 text-xs leading-relaxed text-gray-400">{preset.description}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Wheels & Tires">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Wheel Design">
            <TextInput value={w.wheelDesign} onChange={(wheelDesign) => updateWheels({ wheelDesign })} placeholder="e.g. Multi-spoke, mesh, forged" />
          </Field>
          <Field label="Diameter">
            <Select value={w.wheelDiameter} onChange={(wheelDiameter) => updateWheels({ wheelDiameter })} options={WHEEL_DIAMETERS} />
          </Field>
          <Field label="Color / Finish">
            <Select value={w.wheelFinish} onChange={(wheelFinish) => updateWheels({ wheelFinish })} options={WHEEL_FINISHES} />
          </Field>
          <Field label="Tire Profile">
            <Select value={w.tireProfile} onChange={(tireProfile) => updateWheels({ tireProfile })} options={['Standard', 'Lowered profile', 'Semi-slick', 'Stretched']} />
          </Field>
          <Field label="Brake Caliper Color">
            <div className="flex flex-wrap gap-2 pt-1">
              {CALIPER_COLORS.map((c) => {
                const active = w.caliperColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => updateWheels({ caliperColor: active ? '' : c.name })}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all',
                      active ? 'border-lime-glow/70 shadow-glow-sm' : 'border-white/10 hover:border-white/30',
                    )}
                  >
                    <span className="h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </Card>

      <Card title="Suspension & Fitment">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Suspension Type">
            <Select value={w.suspensionType} onChange={(suspensionType) => updateWheels({ suspensionType })} options={SUSPENSION_TYPES} />
          </Field>
          <Field label="Ride Height">
            <Select value={w.rideHeight} onChange={(rideHeight) => updateWheels({ rideHeight })} options={['Stock', 'Mild drop', 'Low', 'Slammed', 'Raised (lift)']} />
          </Field>
          <Field label="Fitment">
            <Select value={w.fitment} onChange={(fitment) => updateWheels({ fitment })} options={FITMENTS} />
          </Field>
          <Field label="Camber Style">
            <Select value={w.camber} onChange={(camber) => updateWheels({ camber })} options={['Factory', 'Mild negative', 'Aggressive negative', 'Heavy negative']} />
          </Field>
        </div>
      </Card>

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="mb-2 flex items-center gap-2 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-display text-sm font-semibold">Configuration warnings</h3>
          </div>
          <ul className="space-y-1.5 text-sm text-amber-100/90">
            {warnings.map((warn) => (
              <li key={warn} className="flex gap-2">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400" />
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}
    </StepShell>
  );
}
