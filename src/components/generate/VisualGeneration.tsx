import { useState } from 'react';
import {
  Wand2,
  RefreshCw,
  Download,
  Trash2,
  ImageOff,
  Flame,
  Feather,
  Camera,
  Disc3,
  Palette,
  ArrowDownUp,
  Boxes,
  Undo2,
} from 'lucide-react';
import { useConfig } from '../../state/ConfigContext';
import { useAsyncAction } from '../../lib/useAsync';
import { api } from '../../lib/api';
import { Card } from '../steps/StepShell';
import { BeforeAfter } from './BeforeAfter';
import { VehiclePlaceholder } from '../preview/VehiclePlaceholder';
import { ErrorState, LoadingState } from '../ui/states';
import { PAINT_SWATCHES } from '../../constants';

const REFINEMENTS = [
  { label: 'More aggressive', value: 'Make the styling more aggressive', icon: Flame },
  { label: 'More subtle', value: 'Make the styling more subtle', icon: Feather },
  { label: 'More realistic', value: 'Increase photorealism, keep it believable', icon: Camera },
  { label: 'Different wheels', value: 'Try a different wheel design', icon: Disc3 },
  { label: 'Change paint', value: 'Change the paint color', icon: Palette },
  { label: 'Adjust ride height', value: 'Adjust the ride height', icon: ArrowDownUp },
  { label: 'Body kit', value: 'Add or remove body kit elements', icon: Boxes },
];

function paintHex(value: string): string | undefined {
  if (!value) return undefined;
  if (/^#/.test(value)) return value;
  return PAINT_SWATCHES.find((s) => s.name.toLowerCase() === value.toLowerCase())?.hex;
}

export function VisualGeneration() {
  const { state, addConcept, removeConcept } = useConfig();
  const { loading, error, run } = useAsyncAction();
  const [activeId, setActiveId] = useState<string | null>(null);

  const concepts = state.generatedConcepts;
  const active = concepts.find((c) => c.id === activeId) ?? concepts[0] ?? null;

  const generate = (refinement?: string) =>
    run(async () => {
      const { concept } = await api.generate(state, refinement);
      addConcept(concept);
      setActiveId(concept.id);
    });

  const exportSummary = () => {
    const summary = {
      generatedAt: new Date().toISOString(),
      vehicle: state.vehicle,
      theme: state.theme,
      exterior: state.exterior,
      wheels: state.wheels,
      preferences: state.preferences,
      analysis: state.analysis,
      recommendations: state.recommendations,
      concept: active ? { prompt: active.prompt, settings: active.settings, isFallback: active.isFallback } : null,
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automotive-concept-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const beforeSrc = state.image?.dataUrl ?? null;
  const hex = paintHex(state.exterior.paintColor);

  return (
    <Card title="Visual Generation">
      {concepts.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-glow/10 text-lime-glow">
            <Wand2 className="h-7 w-7" />
          </div>
          <div>
            <h4 className="font-display text-base font-semibold text-white">
              Generate a customized concept
            </h4>
            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              The AI builds a design brief from your configuration and renders a modified concept of
              your vehicle, preserving its identity and scene where supported.
            </p>
          </div>
          <button className="btn-primary" onClick={() => generate()}>
            <Wand2 className="h-4 w-4" /> Generate concept
          </button>
        </div>
      )}

      {loading && <LoadingState message="Generating your vehicle concept…" />}
      {!loading && error && <ErrorState message={error} onRetry={() => generate()} />}

      {!loading && active && (
        <div className="space-y-4 animate-fade-in">
          {active.isFallback && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
              <ImageOff className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
              <p>
                {active.note ??
                  'No image-generation provider is configured, so this is a configuration-based concept with reference styling rather than an AI-rendered image. See the README to connect a provider.'}
              </p>
            </div>
          )}

          {/* Comparison or single view */}
          {active.imageUrl && beforeSrc ? (
            <BeforeAfter beforeSrc={beforeSrc} afterSrc={active.imageUrl} />
          ) : active.imageUrl ? (
            <img
              src={active.imageUrl}
              alt="Generated concept"
              className="aspect-video w-full rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-charcoal-900 p-3">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">Original</p>
                {beforeSrc ? (
                  <img src={beforeSrc} alt="Original" className="aspect-video w-full rounded-lg object-cover" />
                ) : (
                  <VehiclePlaceholder className="aspect-video w-full" />
                )}
              </div>
              <div className="rounded-2xl border border-lime-glow/30 bg-charcoal-900 p-3">
                <p className="mb-2 text-[11px] uppercase tracking-wide text-lime-soft">Concept (styled)</p>
                <VehiclePlaceholder paintColor={hex} className="aspect-video w-full" />
              </div>
            </div>
          )}

          {/* Prompt / brief */}
          <details className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-300">
              Design brief used for this concept
            </summary>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-400">{active.prompt}</p>
          </details>

          {/* Refinement controls */}
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">Refine</p>
            <div className="flex flex-wrap gap-2">
              {REFINEMENTS.map((r) => (
                <button key={r.label} className="chip-off" onClick={() => generate(r.value)} type="button">
                  <r.icon className="h-3.5 w-3.5" />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
            <button className="btn-primary" onClick={() => generate()}>
              <RefreshCw className="h-4 w-4" /> Regenerate
            </button>
            <button className="btn-secondary" onClick={exportSummary}>
              <Download className="h-4 w-4" /> Export summary
            </button>
            {concepts.length > 1 && active && (
              <button
                className="btn-ghost"
                onClick={() => {
                  const idx = concepts.findIndex((c) => c.id === active.id);
                  const prev = concepts[idx + 1];
                  if (prev) setActiveId(prev.id);
                }}
              >
                <Undo2 className="h-4 w-4" /> Previous concept
              </button>
            )}
          </div>

          {/* History */}
          {concepts.length > 1 && (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">
                History ({concepts.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {concepts.map((c) => (
                  <div key={c.id} className="group relative flex-shrink-0">
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`relative h-16 w-24 overflow-hidden rounded-lg border transition-all ${
                        c.id === active.id ? 'border-lime-glow shadow-glow-sm' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt="Concept" className="h-full w-full object-cover" />
                      ) : (
                        <VehiclePlaceholder paintColor={hex} className="h-full w-full" />
                      )}
                    </button>
                    <button
                      onClick={() => removeConcept(c.id)}
                      className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                      title="Delete concept"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
