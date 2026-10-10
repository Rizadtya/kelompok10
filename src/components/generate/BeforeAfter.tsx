import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/** Draggable before/after comparison slider. Keyboard-accessible. */
export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Original',
  afterLabel = 'Concept',
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-white/10"
      onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      {/* After (full) */}
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute right-3 top-3 pill bg-lime-glow/20 text-lime-soft">{afterLabel}</span>

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current?.clientWidth ?? '100%' }}
        />
        <span className="absolute left-3 top-3 pill border border-white/10 bg-charcoal-900/80 text-gray-300">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        role="slider"
        aria-label="Comparison position"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="absolute inset-y-0 z-10 flex w-0.5 cursor-ew-resize items-center justify-center bg-lime-glow"
        style={{ left: `${pos}%` }}
        onMouseDown={() => (dragging.current = true)}
        onTouchStart={() => (dragging.current = true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
        }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-glow text-charcoal-950 shadow-glow-sm">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
