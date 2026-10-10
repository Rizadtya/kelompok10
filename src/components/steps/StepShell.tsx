import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepShellProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
}

export function StepShell({
  title,
  description,
  badge,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled,
}: StepShellProps) {
  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="section-title">{title}</h1>
            {badge}
          </div>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-gray-400">{description}</p>}
        </div>
      </header>

      <div className="space-y-6">{children}</div>

      {(onBack || onNext) && (
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
          {onBack ? (
            <button type="button" className="btn-secondary" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          ) : (
            <span />
          )}
          {onNext && (
            <button type="button" className="btn-primary" onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass-panel p-5 ${className ?? ''}`}>
      {title && (
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-gray-300">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
