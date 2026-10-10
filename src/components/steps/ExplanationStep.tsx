import { useEffect } from 'react';
import {
  BookOpenText,
  Sparkles,
  Fingerprint,
  Palette,
  Car,
  Disc3,
  Scale,
  Eye,
  Wrench,
  Download,
  RotateCcw,
} from 'lucide-react';
import { StepShell, Card } from './StepShell';
import { EmptyState, ErrorState, LoadingState } from '../ui/states';
import { useConfig } from '../../state/ConfigContext';
import { useAsyncAction } from '../../lib/useAsync';
import { api } from '../../lib/api';
import type { DesignExplanation } from '../../types';

const SECTIONS: { key: keyof DesignExplanation; title: string; icon: typeof Palette }[] = [
  { key: 'philosophy', title: 'Design philosophy', icon: Sparkles },
  { key: 'visualIdentity', title: 'Visual identity', icon: Fingerprint },
  { key: 'colorPalette', title: 'Color palette', icon: Palette },
  { key: 'bodyStyling', title: 'Body styling', icon: Car },
  { key: 'wheelsSuspension', title: 'Wheels & suspension', icon: Disc3 },
  { key: 'balanceProportions', title: 'Visual balance & proportions', icon: Scale },
  { key: 'visualImpact', title: 'Expected visual impact', icon: Eye },
  { key: 'practicalConsiderations', title: 'Practical considerations', icon: Wrench },
];

export function ExplanationStep({ onBack, onRestart }: { onBack: () => void; onRestart: () => void }) {
  const { state, setExplanation } = useConfig();
  const { loading, error, run } = useAsyncAction();
  const exp = state.explanation;

  const explain = () =>
    run(async () => {
      const { explanation } = await api.explain(state);
      setExplanation(explanation);
    });

  useEffect(() => {
    if (!exp && !loading) explain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportText = () => {
    if (!exp) return;
    const lines = [
      `AUTOMOTIVE AI VISUALIZER — DESIGN EXPLANATION`,
      `Vehicle: ${[state.vehicle.year, state.vehicle.make, state.vehicle.model].filter(Boolean).join(' ') || 'N/A'}`,
      `Theme: ${[state.theme.primary, ...state.theme.secondary].filter(Boolean).join(', ') || 'N/A'}`,
      ``,
      ...SECTIONS.flatMap((s) => [`## ${s.title}`, exp[s.key], ``]),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-explanation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StepShell
      title="Design Explanation"
      description="A structured rationale for the final concept — the thinking behind every major choice."
      onBack={onBack}
    >
      {loading && <LoadingState message="Writing your design explanation…" />}
      {!loading && error && <ErrorState message={error} onRetry={explain} />}

      {!loading && !error && !exp && (
        <EmptyState
          icon={<BookOpenText className="h-10 w-10" />}
          title="No explanation yet"
          description="Generate a structured explanation of your final concept."
          action={
            <button className="btn-primary" onClick={explain}>
              <Sparkles className="h-4 w-4" /> Generate explanation
            </button>
          }
        />
      )}

      {!loading && !error && exp && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid gap-4 lg:grid-cols-2">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.key}>
                  <div className="mb-2 flex items-center gap-2 text-gray-300">
                    <Icon className="h-4 w-4 text-lime-glow/70" />
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wide">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">{exp[s.key]}</p>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
            <div className="flex gap-2">
              <button className="btn-primary" onClick={exportText}>
                <Download className="h-4 w-4" /> Export explanation
              </button>
              <button className="btn-secondary" onClick={explain}>
                <Sparkles className="h-4 w-4" /> Regenerate
              </button>
            </div>
            <button className="btn-ghost" onClick={onRestart}>
              <RotateCcw className="h-4 w-4" /> Start a new build
            </button>
          </div>
        </div>
      )}
    </StepShell>
  );
}
