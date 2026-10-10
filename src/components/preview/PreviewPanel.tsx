import { ImageIcon, Palette, Layers, Disc3, Target, Gauge } from 'lucide-react';
import { useConfig } from '../../state/ConfigContext';
import { VehiclePlaceholder } from './VehiclePlaceholder';
import { PAINT_SWATCHES } from '../../constants';
import { cn } from '../../lib/utils';

function paintHex(value: string): string | undefined {
  if (!value) return undefined;
  if (/^#([0-9a-f]{3,8})$/i.test(value)) return value;
  const found = PAINT_SWATCHES.find((s) => s.name.toLowerCase() === value.toLowerCase());
  return found?.hex;
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Palette;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-glow/70" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
        <p className="truncate text-sm text-gray-200">{value || <span className="text-gray-600">Not set</span>}</p>
      </div>
    </div>
  );
}

export function PreviewPanel() {
  const { state } = useConfig();
  const { vehicle, image, theme, exterior, wheels, preferences } = state;

  const hex = paintHex(exterior.paintColor);
  const vehicleName =
    [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Your vehicle';

  const themeLabel = theme.primary
    ? [theme.primary, ...theme.secondary].join(' · ')
    : '';

  const wheelLabel = [wheels.wheelDiameter, wheels.wheelFinish, wheels.wheelDesign]
    .filter(Boolean)
    .join(' · ');

  const exteriorLabel = [exterior.paintFinish, exterior.paintColor, exterior.bodyWrap && `${exterior.bodyWrap} wrap`]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gray-400">
          Live Preview
        </h2>
        <p className="mt-0.5 text-xs text-gray-600">Updates as you configure</p>
      </div>

      {/* Visual */}
      <div className="glass-panel glass-panel-sheen relative aspect-[16/10] w-full overflow-hidden">
        {image ? (
          <img
            src={image.dataUrl}
            alt="Uploaded vehicle"
            className="h-full w-full object-cover"
          />
        ) : (
          <VehiclePlaceholder paintColor={hex} className="h-full w-full" />
        )}
        {/* paint tint overlay reacts to the chosen color */}
        {image && hex && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
            style={{ backgroundColor: hex }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal-950/90 to-transparent p-3">
          <p className="truncate text-sm font-semibold text-white">{vehicleName}</p>
          {themeLabel && <p className="truncate text-xs text-lime-soft">{themeLabel}</p>}
        </div>
        {!image && (
          <span className="absolute right-3 top-3 pill border border-white/10 bg-charcoal-900/70 text-gray-400">
            <ImageIcon className="h-3 w-3" /> Placeholder
          </span>
        )}
      </div>

      {/* Paint swatch strip */}
      {hex && (
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
          <span
            className="h-7 w-7 flex-shrink-0 rounded-full border border-white/20"
            style={{ backgroundColor: hex }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm text-gray-200">{exterior.paintColor}</p>
            <p className="text-[11px] text-gray-500">{exterior.paintFinish || 'Finish not set'}</p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="glass-panel flex-1 divide-y divide-white/5 overflow-y-auto px-4 py-1">
        <SummaryRow icon={Palette} label="Theme" value={themeLabel} />
        <SummaryRow icon={Layers} label="Exterior" value={exteriorLabel} />
        <SummaryRow icon={Disc3} label="Wheels & Suspension" value={[wheelLabel, wheels.suspensionType].filter(Boolean).join(' · ')} />
        <SummaryRow icon={Target} label="Intended Use" value={preferences.intendedUse} />
        <SummaryRow
          icon={Gauge}
          label="Realism / Complexity"
          value={`${preferences.realism}/5 realism · ${preferences.complexity}/5 complexity`}
        />
      </div>

      {state.generatedConcepts.length > 0 && (
        <div className="glass-panel p-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">
            Generated concepts ({state.generatedConcepts.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {state.generatedConcepts.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className={cn(
                  'relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10',
                  c.isFallback && 'bg-charcoal-800',
                )}
                title={c.isFallback ? 'Fallback concept' : 'Generated image'}
              >
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt="Concept" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-500">
                    Fallback
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
