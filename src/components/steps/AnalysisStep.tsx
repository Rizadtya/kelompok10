import { useEffect } from 'react';
import {
  ScanSearch,
  Eye,
  Wrench,
  Lightbulb,
  ShieldCheck,
  Ban,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { StepShell, Card } from './StepShell';
import { EmptyState, ErrorState, LoadingState } from '../ui/states';
import { useConfig } from '../../state/ConfigContext';
import { useAsyncAction } from '../../lib/useAsync';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const tone = pct >= 70 ? 'bg-lime-glow' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-charcoal-700">
        <div className={cn('h-full', tone)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400">{pct}% confidence</span>
    </div>
  );
}

function ListCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Eye;
  title: string;
  items: string[];
}) {
  if (!items?.length) return null;
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2 text-gray-300">
        <Icon className="h-4 w-4 text-lime-glow/70" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-gray-300">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-lime-glow/70" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AnalysisStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, setAnalysis } = useConfig();
  const { loading, error, run } = useAsyncAction();
  const analysis = state.analysis;

  const analyze = () =>
    run(async () => {
      const { analysis } = await api.analyze(state);
      setAnalysis(analysis);
    });

  // Auto-run once on first visit if we have enough context.
  useEffect(() => {
    if (!analysis && !loading && (state.image || state.vehicle.make || state.vehicle.model)) {
      analyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepShell
      title="Vehicle Analysis"
      description="The AI reviews your photo and details, then separates visual estimates from the specs you provided."
      onBack={onBack}
      onNext={onNext}
      nextLabel="Get Recommendations"
      nextDisabled={!analysis}
    >
      {loading && <LoadingState message="Analyzing your vehicle…" />}

      {!loading && error && <ErrorState message={error} onRetry={analyze} />}

      {!loading && !error && !analysis && (
        <EmptyState
          icon={<ScanSearch className="h-10 w-10" />}
          title="No analysis yet"
          description="Add a photo or vehicle details, then run the analysis to get started."
          action={
            <button className="btn-primary" onClick={analyze}>
              <Sparkles className="h-4 w-4" /> Run analysis
            </button>
          }
        />
      )}

      {!loading && !error && analysis && (
        <div className="space-y-5 animate-fade-in">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500">Identification estimate</p>
                <h3 className="mt-1 font-display text-lg font-bold text-white">{analysis.identification}</h3>
                {analysis.bodyStyle && <p className="mt-0.5 text-sm text-gray-400">{analysis.bodyStyle}</p>}
              </div>
              <ConfidenceBar value={analysis.confidence} />
            </div>
            {analysis.notes && <p className="mt-3 text-sm text-gray-400">{analysis.notes}</p>}

            {analysis.needsUserInput && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                <p>
                  The AI could not confidently identify this vehicle. Please confirm the make and
                  model on the Vehicle Information step for more accurate recommendations.
                </p>
              </div>
            )}
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <ListCard icon={Eye} title="Visible characteristics" items={analysis.characteristics} />
            <ListCard icon={Wrench} title="Existing modifications" items={analysis.existingMods} />
            <ListCard icon={Lightbulb} title="Recommended directions" items={analysis.recommendedDirections} />
            <ListCard icon={ShieldCheck} title="Compatibility considerations" items={analysis.compatibility} />
          </div>

          <ListCard icon={Ban} title="Potential design constraints" items={analysis.constraints} />

          <div className="flex justify-end">
            <button className="btn-secondary" onClick={analyze}>
              <ScanSearch className="h-4 w-4" /> Re-analyze
            </button>
          </div>
        </div>
      )}
    </StepShell>
  );
}
