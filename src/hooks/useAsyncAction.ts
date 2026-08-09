import { useCallback, useState } from 'react';

/**
 * Wraps a fallible async operation (create/update/delete) with loading and
 * error state, so dialogs don't each re-implement the same bookkeeping.
 */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      setLoading(true);
      setError(undefined);
      try {
        return await action(...args);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { run, loading, error, setError };
}
