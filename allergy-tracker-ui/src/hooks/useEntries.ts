import {useEffect, useState} from 'react';
import type {Entry} from '../mocks/types';
import {apiGet} from '../api/client';

export function useEntries() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    apiGet<Entry[]>('/api/entries')
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(
        (e) =>
          alive && setError(e instanceof Error ? e.message : 'Błąd ładowania'),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return {data, setData, loading, error};
}
