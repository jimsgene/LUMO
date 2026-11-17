import { useCallback, useEffect, useState } from 'react';

// Runs an async loader and tracks its state without calling setState synchronously inside the effect.
// `key` identifies the request (e.g. a route id): while a new key is loading the hook reports
// 'loading' instead of showing the previous record.
export function useAsync(loader, key = '') {
  const [result, setResult] = useState({ key: null, status: 'loading', data: null, error: null });
  const [nonce, setNonce] = useState(0);
  const reqKey = `${key}#${nonce}`;

  useEffect(() => {
    let alive = true;
    Promise.resolve()
      .then(loader)
      .then(
        (data) => alive && setResult({ key: reqKey, status: 'ready', data, error: null }),
        (error) => alive && setResult({ key: reqKey, status: 'error', data: null, error }),
      );
    return () => { alive = false; };
    // The loader is intentionally keyed by `reqKey`, not by identity (callers pass inline functions).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqKey]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  // After a reload keep showing the previous data (no flash); only a new key shows 'loading'.
  const sameKey = result.key !== null && result.key.split('#')[0] === String(key);
  if (!sameKey) return { status: 'loading', data: null, error: null, reload };
  return { ...result, reload };
}

// Throw on a Supabase error so useAsync can catch it.
export const must = ({ data, error }) => { if (error) throw error; return data; };
