import { ArrowRight, Compass, Sparkles, Wand2, Gauge } from 'lucide-react';
import { THEMES } from '../../constants';
import type { StepId } from '../../types';

const FEATURED = ['JDM', 'Stance', 'Racing', 'Luxury', 'Off-Road', 'Futuristic'] as const;

const EXAMPLE_PROJECTS = [
  { name: 'Street JDM GR86', detail: 'Bronze wheels · subtle lip · pearl white', accent: 'from-rose-500/20' },
  { name: 'Track-prep M3', detail: 'Coilovers · aero kit · roll cage look', accent: 'from-amber-400/20' },
  { name: 'Luxe S-Class', detail: 'Satin wrap · 21s · chrome delete', accent: 'from-yellow-600/20' },
];

export function WelcomeStep({ onNavigate }: { onNavigate: (id: StepId) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <section className="glass-panel glass-panel-sheen relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-glow/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="pill border border-lime-glow/30 bg-lime-glow/10 text-lime-soft">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Vehicle Customization
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Visualize Your <span className="text-lime-glow text-glow">Automotive Vision</span>.
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-400">
            Upload your vehicle, choose a styling direction, and let AI build a tailored modification
            concept — with analysis, recommendations, and a clear design rationale for every choice.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="btn-primary px-5 py-3" onClick={() => onNavigate('photo')}>
              Start Customizing
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="btn-secondary px-5 py-3" onClick={() => onNavigate('theme')}>
              <Compass className="h-4 w-4" />
              Explore Design Concepts
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Wand2, title: 'Configure', text: 'Photo, vehicle info, theme, exterior, wheels, and your custom brief.' },
          { icon: Gauge, title: 'Analyze', text: 'AI reviews your vehicle and surfaces constraints and directions.' },
          { icon: Sparkles, title: 'Visualize', text: 'Generate a concept, compare before/after, refine, and export.' },
        ].map((f) => (
          <div key={f.title} className="glass-panel p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-glow/10 text-lime-glow">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Featured styles */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Featured modification styles</h2>
          <button className="btn-ghost text-xs" onClick={() => onNavigate('theme')}>
            View all themes <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FEATURED.map((id) => {
            const meta = THEMES.find((t) => t.id === id)!;
            return (
              <button
                key={id}
                onClick={() => onNavigate('theme')}
                className={`group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${meta.accent} to-charcoal-900 p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-lime-glow/40`}
              >
                <span className="font-display text-sm font-bold text-white">{id}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Example projects */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-white">Example vehicle projects</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {EXAMPLE_PROJECTS.map((p) => (
            <div
              key={p.name}
              className={`glass-panel relative overflow-hidden bg-gradient-to-br ${p.accent} to-transparent p-5`}
            >
              <h3 className="font-display font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-xs text-gray-400">{p.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
