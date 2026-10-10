import type { ReactNode } from 'react';
import { AlertTriangle, Loader2, Inbox, CheckCircle2 } from 'lucide-react';

export function LoadingState({ message = 'Working with the AI model…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-lime-glow" />
        <span className="absolute inset-0 animate-pulse-glow rounded-full bg-lime-glow/10 blur-xl" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
      <div className="w-full max-w-sm space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-4/6" />
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 py-12 px-6 text-center animate-fade-in">
      <AlertTriangle className="h-9 w-9 text-red-400" />
      <p className="max-w-md text-sm text-red-200">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-1" onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-14 px-6 text-center animate-fade-in">
      <div className="text-gray-600">{icon ?? <Inbox className="h-10 w-10" />}</div>
      <h3 className="font-display text-lg font-semibold text-gray-200">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500">{description}</p>
      {action}
    </div>
  );
}

export function SuccessBadge({ text }: { text: string }) {
  return (
    <span className="pill bg-lime-glow/15 text-lime-soft">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
