import { useEffect, useState } from 'react';
import { getContext, type IContext } from '@microsoft/power-apps/app';

/** Live Power Platform host context (signed-in user, environment, etc). */
export function useAppContext() {
  const [context, setContext] = useState<IContext>();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ctx = await getContext();
      if (!cancelled) setContext(ctx);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return context;
}
