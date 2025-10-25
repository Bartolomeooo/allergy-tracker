import type {Entry} from '../../mocks/types';

export type SymptomsKey =
  | 'upperRespiratory'
  | 'lowerRespiratory'
  | 'skin'
  | 'eyes';

export type SymptomsShareDatum = {
  id: number;
  key: SymptomsKey;
  label: string;
  value: number;
};

export function getSymptomsShare(entries: Entry[]): SymptomsShareDatum[] {
  if (!entries || entries.length === 0) return [];

  let upper = 0,
    lower = 0,
    skin = 0,
    eyes = 0,
    total = 0;
  for (const e of entries) {
    upper += e.upperRespiratory ?? 0;
    lower += e.lowerRespiratory ?? 0;
    skin += e.skin ?? 0;
    eyes += e.eyes ?? 0;
    total += e.total ?? 0;
  }

  if (total === 0) return [];

  const base: SymptomsShareDatum[] = [
    {
      id: 0,
      key: 'upperRespiratory',
      label: 'Górne drogi oddechowe',
      value: upper,
    },
    {
      id: 1,
      key: 'lowerRespiratory',
      label: 'Dolne drogi oddechowe',
      value: lower,
    },
    {id: 2, key: 'skin', label: 'Skóra', value: skin},
    {id: 3, key: 'eyes', label: 'Oczy', value: eyes},
  ];

  return base.filter((d) => d.value > 0);
}
