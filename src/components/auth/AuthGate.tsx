import type { ReactNode } from 'react';
import { useAuth } from '../../state/AuthContext';
import { AuthScreen } from './AuthScreen';
import { Spinner } from '../ui/Spinner';

/**
 * Decides what to show based on auth state:
 *   - Supabase not configured  -> render the app (dev/mock mode stays usable).
 *   - Configured + restoring    -> brief loading spinner.
 *   - Configured + logged out   -> the login/signup screen.
 *   - Configured + logged in    -> the app.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { configured, loading, user } = useAuth();

  if (!configured) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return <>{children}</>;
}
