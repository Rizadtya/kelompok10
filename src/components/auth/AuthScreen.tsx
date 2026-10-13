import { useState } from 'react';
import { Zap, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { Spinner } from '../ui/Spinner';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        const { error, needsConfirmation } = await signUp(email, password);
        if (error) {
          setError(error);
        } else if (needsConfirmation) {
          setInfo('Account created. Check your email to confirm, then sign in.');
          setMode('signin');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-glow text-charcoal-950 shadow-glow-md">
            <Zap className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Automotive AI Visualizer</h1>
          <p className="mt-1 text-sm text-gray-400">
            {mode === 'signin' ? 'Sign in to start customizing' : 'Create an account to get started'}
          </p>
        </div>

        {!configured && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-100">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
            <p>
              Supabase is not configured yet. Fill in <code>SUPABASE_URL</code> and{' '}
              <code>SUPABASE_ANON_KEY</code> in <code>public/public_config.js</code> to enable login.
            </p>
          </div>
        )}

        <form onSubmit={submit} className="glass-panel space-y-4 p-6">
          <div>
            <label className="field-label">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                autoComplete="email"
                className="field-input pl-9"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy || !configured}
              />
            </div>
          </div>

          <div>
            <label className="field-label">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="field-input pl-9"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy || !configured}
              />
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {info && (
            <p className="flex items-start gap-2 rounded-lg border border-lime-glow/30 bg-lime-glow/5 px-3 py-2 text-sm text-lime-soft">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {info}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-3" disabled={busy || !configured}>
            {busy ? (
              <Spinner />
            ) : mode === 'signin' ? (
              <>
                <LogIn className="h-4 w-4" /> Sign in
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Create account
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="font-semibold text-lime-soft hover:underline"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setInfo(null);
              }}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
