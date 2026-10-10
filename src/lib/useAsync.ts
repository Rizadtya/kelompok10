import { useCallback, useState } from 'react';
import { ApiError } from './api';

interface AsyncState {
  loading: boolean;
  error: string | null;
}

/** Small helper to run an async action with loading/error bookkeeping. */
export function useAsyncAction() {
  const [state, setState] = useState<AsyncState>({ loading: false, error: null });

  const run = useCallback(async (fn: () => Promise<void>) => {
    setState({ loading: true, error: null });
    try {
      await fn();
      setState({ loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong.';
      setState({ loading: false, error: message });
    }
  }, []);

  const clearError = useCallback(() => setState((s) => ({ ...s, error: null })), []);

  return { ...state, run, clearError };
}
