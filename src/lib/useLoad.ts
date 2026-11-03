// File: src/lib/useLoad.ts  (fanitt-website)
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from './api';

/** Loads data for a page; `reload()` fetches again (e.g. after paying). */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  const notFound = error instanceof ApiError && (error.status === 404 || error.status === 400);
  return { data, error, loading, reload, notFound };
}