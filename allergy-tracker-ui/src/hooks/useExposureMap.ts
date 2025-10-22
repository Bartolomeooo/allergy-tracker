import {useEffect, useState} from 'react';
import type {ExposureType} from '../mocks/types';
import {apiGet} from '../api/client';

export function useExposureMap() {
  const [nameToId, setNameToId] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    apiGet<ExposureType[]>('/api/exposure-types')
      .then((list) => {
        if (alive)
          setNameToId(Object.fromEntries(list.map((e) => [e.name, e.id])));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return nameToId;
}
