import { useEffect } from 'react';

/** Runs an async refresh function on mount / whenever it changes, guarding against post-unmount state updates. */
export function useAutoRefresh(refresh: () => Promise<void>) {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);
}
