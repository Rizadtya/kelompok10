import { cn } from '../../lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-lime-glow/30 border-t-lime-glow',
        className,
      )}
      aria-hidden
    />
  );
}
