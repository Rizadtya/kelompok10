import { useCallback, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ProgressBar } from './components/layout/ProgressBar';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { PhotoStep } from './components/steps/PhotoStep';
import { InfoStep } from './components/steps/InfoStep';
import { ThemeStep } from './components/steps/ThemeStep';
import { ExteriorStep } from './components/steps/ExteriorStep';
import { WheelsStep } from './components/steps/WheelsStep';
import { CustomStep } from './components/steps/CustomStep';
import { AnalysisStep } from './components/steps/AnalysisStep';
import { RecommendationsStep } from './components/steps/RecommendationsStep';
import { ExplanationStep } from './components/steps/ExplanationStep';
import { FLOW_STEPS } from './constants';
import { useConfig } from './state/ConfigContext';
import type { StepId } from './types';

export default function App() {
  const { state, reset } = useConfig();
  const [active, setActive] = useState<StepId>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const navigate = useCallback((id: StepId) => {
    setActive(id);
    window.scrollTo({ top: 0 });
    const main = document.getElementById('workspace-scroll');
    main?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goRelative = useCallback(
    (delta: number) => {
      const idx = FLOW_STEPS.indexOf(active);
      if (idx === -1) {
        navigate(delta > 0 ? FLOW_STEPS[0] : 'welcome');
        return;
      }
      const nextIdx = idx + delta;
      if (nextIdx < 0) navigate('welcome');
      else if (nextIdx >= FLOW_STEPS.length) navigate(FLOW_STEPS[FLOW_STEPS.length - 1]);
      else navigate(FLOW_STEPS[nextIdx]);
    },
    [active, navigate],
  );

  // Derive which steps are "complete" for the sidebar/progress indicators.
  const completed = useMemo(() => {
    const set = new Set<StepId>();
    if (state.image) set.add('photo');
    if (state.vehicle.make || state.vehicle.model) set.add('info');
    if (state.theme.primary) set.add('theme');
    if (state.exterior.paintColor || state.exterior.frontBumper) set.add('exterior');
    if (state.wheels.preset || state.wheels.wheelFinish) set.add('wheels');
    if (state.preferences.customRequest || state.preferences.budgetRange) set.add('custom');
    if (state.analysis) set.add('analysis');
    if (state.recommendations) set.add('recommendations');
    if (state.explanation) set.add('explanation');
    return set;
  }, [state]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all configuration and start over? This cannot be undone.')) {
      reset();
      navigate('welcome');
    }
  }, [reset, navigate]);

  const renderStep = () => {
    switch (active) {
      case 'welcome':
        return <WelcomeStep onNavigate={navigate} />;
      case 'photo':
        return <PhotoStep onBack={() => navigate('welcome')} onNext={() => goRelative(1)} />;
      case 'info':
        return <InfoStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'theme':
        return <ThemeStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'exterior':
        return <ExteriorStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'wheels':
        return <WheelsStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'custom':
        return <CustomStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'analysis':
        return <AnalysisStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'recommendations':
        return <RecommendationsStep onBack={() => goRelative(-1)} onNext={() => goRelative(1)} />;
      case 'explanation':
        return (
          <ExplanationStep
            onBack={() => goRelative(-1)}
            onRestart={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        active={active}
        onNavigate={navigate}
        completed={completed}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(true)}
          onTogglePreview={() => setPreviewOpen((o) => !o)}
          onReset={handleReset}
        />

        {active !== 'welcome' && (
          <ProgressBar active={active} completed={completed} onNavigate={navigate} />
        )}

        <div className="flex min-h-0 flex-1">
          {/* Center workspace */}
          <main
            id="workspace-scroll"
            className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-4xl">{renderStep()}</div>
          </main>

          {/* Right preview (desktop) */}
          <aside className="hidden w-[360px] flex-shrink-0 overflow-y-auto border-l border-white/5 bg-charcoal-900/40 p-5 xl:block">
            <PreviewPanel />
          </aside>
        </div>
      </div>

      {/* Mobile/tablet preview drawer */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto border-l border-white/10 bg-charcoal-900 p-5 animate-fade-in">
            <div className="mb-3 flex justify-end">
              <button className="btn-ghost p-1.5" onClick={() => setPreviewOpen(false)} aria-label="Close preview">
                <X className="h-5 w-5" />
              </button>
            </div>
            <PreviewPanel />
          </div>
        </div>
      )}
    </div>
  );
}
