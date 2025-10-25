import type {Entry} from '../../mocks/types';

export type ExposureFrequencyRow = {name: string; days: number};

const toDay = (iso: string) => iso.slice(0, 10);

export function buildExposureFrequencyAll(
  entries: Entry[],
  topN = 10,
): ExposureFrequencyRow[] {
  const allDaysByExposure = new Map<string, Set<string>>();

  for (const e of entries) {
    const d = toDay(e.occurredOn);
    for (const x of e.exposures) {
      const set = allDaysByExposure.get(x) ?? new Set<string>();
      set.add(d);
      allDaysByExposure.set(x, set);
    }
  }

  const rows: ExposureFrequencyRow[] = Array.from(
    allDaysByExposure,
    ([name, daysSet]) => ({name, days: daysSet.size}),
  );

  rows.sort((a, b) => b.days - a.days);
  return rows.slice(0, topN);
}

export function getTopExposures(
  entries: Entry[],
  opts: {topN?: number} = {},
): ExposureFrequencyRow[] {
  const {topN = 10} = opts;
  return buildExposureFrequencyAll(entries, topN);
}
