import { useEffect, useState } from 'react';
import { Menu, PanelRightOpen, RotateCcw, Cpu, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { api } from '../../lib/api';
import { Tooltip } from '../ui/Tooltip';
import type { ProviderStatus } from '../../types';
import { useAuth } from '../../state/AuthContext';

export function TopBar({
  onToggleSidebar,
  onTogglePreview,
  onReset,
}: {
  onToggleSidebar: () => void;
  onTogglePreview: () => void;
  onReset: () => void;
}) {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [offline, setOffline] = useState(false);
  const { configured: authConfigured, user, signOut } = useAuth();

  useEffect(() => {
    api
      .status()
      .then(setStatus)
      .catch(() => setOffline(true));
  }, []);

  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/5 bg-charcoal-900/70 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button className="btn-ghost p-2 lg:hidden" onClick={onToggleSidebar} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-sm font-semibold text-white sm:text-base">
          Automotive AI Visualizer
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <ProviderPill status={status} offline={offline} />
        <Tooltip label="Reset all configuration" side="bottom">
          <button className="btn-ghost p-2" onClick={onReset} aria-label="Reset">
            <RotateCcw className="h-4 w-4" />
          </button>
        </Tooltip>
        <Tooltip label="Toggle live preview" side="bottom">
          <button className="btn-ghost p-2 xl:hidden" onClick={onTogglePreview} aria-label="Toggle preview">
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </Tooltip>

        {authConfigured && user && (
          <>
            <span className="hidden max-w-[160px] truncate text-xs text-gray-400 sm:inline" title={user.email ?? ''}>
              {user.email}
            </span>
            <Tooltip label="Sign out" side="bottom">
              <button className="btn-ghost p-2" onClick={() => void signOut()} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </Tooltip>
          </>
        )}
      </div>
    </header>
  );
}

function ProviderPill({ status, offline }: { status: ProviderStatus | null; offline: boolean }) {
  if (offline) {
    return (
      <Tooltip label="AI server not reachable — start it with: npm run server" side="bottom">
        <span className="pill border border-red-500/30 bg-red-500/10 text-red-300">
          <AlertCircle className="h-3.5 w-3.5" /> Server offline
        </span>
      </Tooltip>
    );
  }
  if (!status) {
    return (
      <span className="pill border border-white/10 bg-white/5 text-gray-500">
        <Cpu className="h-3.5 w-3.5" /> …
      </span>
    );
  }
  const configured = status.configured;
  return (
    <Tooltip
      label={
        configured
          ? `AI provider: text=${status.text}, vision=${status.vision}, image=${status.image}`
          : 'Running in mock mode — connect a provider in .env for real AI output'
      }
      side="bottom"
    >
      <span
        className={`pill border ${
          configured
            ? 'border-lime-glow/30 bg-lime-glow/10 text-lime-soft'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
        }`}
      >
        {configured ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
        {configured ? 'AI connected' : 'Mock mode'}
      </span>
    </Tooltip>
  );
}
