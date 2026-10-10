import { useEffect } from 'react';
import { ListChecks, Sparkles, Palette, Layers3 } from 'lucide-react';
import { StepShell, Card } from './StepShell';
import { EmptyState, ErrorState, LoadingState } from '../ui/states';
import { RecommendationCard } from './RecommendationCard';
import { VisualGeneration } from '../generate/VisualGeneration';
import { useConfig } from '../../state/ConfigContext';
import { useAsyncAction } from '../../lib/useAsync';
import { api } from '../../lib/api';

export function RecommendationsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { state, setRecommendations } = useConfig();
  const { loading, error, run } = useAsyncAction();
  const rec = state.recommendations;

  const recommend = () =>
    run(async () => {
      const { recommendations } = await api.recommend(state);
      setRecommendations(recommendations);
    });

  useEffect(() => {
    if (!rec && !loading) recommend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepShell
      title="Modification Recommendations"
      description="Personalized recommendations based on your vehicle, theme, intended use, and budget — with priorities and honest pricing caveats."
      onBack={onBack}
      onNext={onNext}
      nextLabel="Design Explanation"
      nextDisabled={!rec}
    >
      {loading && <LoadingState message="Building your recommendations…" />}
      {!loading && error && <ErrorState message={error} onRetry={recommend} />}

      {!loading && !error && !rec && (
        <EmptyState
          icon={<ListChecks className="h-10 w-10" />}
          title="No recommendations yet"
          description="Generate recommendations tailored to your configuration."
          action={
            <button className="btn-primary" onClick={recommend}>
              <Sparkles className="h-4 w-4" /> Generate
            </button>
          }
        />
      )}

      {!loading && !error && rec && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <p className="text-sm leading-relaxed text-gray-300">{rec.summary}</p>
          </Card>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-white">
              <Layers3 className="h-4 w-4 text-lime-glow" /> Exterior modifications
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {rec.exterior.map((item, i) => (
                <RecommendationCard key={i} item={item} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-white">
              <ListChecks className="h-4 w-4 text-lime-glow" /> Wheel & suspension setup
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {rec.wheelsSuspension.map((item, i) => (
                <RecommendationCard key={i} item={item} />
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Color & material palette">
              <div className="space-y-2.5">
                {rec.colorPalette.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 flex-shrink-0 rounded-lg border border-white/15"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div>
                      <p className="text-sm text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Styling combinations">
              <ul className="space-y-2 text-sm text-gray-300">
                {rec.stylingCombinations.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <Palette className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-glow/70" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <p className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-gray-500">
            {rec.pricingDisclaimer}
          </p>

          {/* Core feature: visual generation */}
          <VisualGeneration />

          <div className="flex justify-end">
            <button className="btn-secondary" onClick={recommend}>
              <Sparkles className="h-4 w-4" /> Regenerate recommendations
            </button>
          </div>
        </div>
      )}
    </StepShell>
  );
}
