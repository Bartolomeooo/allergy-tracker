import type {Entry} from '../../mocks/types';

export type HeatmapAxis = {
  xLabels: string[];
  yLabels: string[];
  matrix: number[][];
};

const GROUPS = [
  {key: 'upperRespiratory' as const, label: 'Górne drogi oddechowe'},
  {key: 'lowerRespiratory' as const, label: 'Dolne drogi oddechowe'},
  {key: 'skin' as const, label: 'Skóra'},
  {key: 'eyes' as const, label: 'Oczy'},
];

export function getExposureSymptoms(
  entries: Entry[],
  {topN = 10}: {topN?: number} = {},
): HeatmapAxis {
  if (!entries?.length) {
    return {xLabels: GROUPS.map((g) => g.label), yLabels: [], matrix: []};
  }

  const freq = new Map<string, number>();
  for (const e of entries) {
    for (const ex of e.exposures ?? []) {
      freq.set(ex, (freq.get(ex) ?? 0) + 1);
    }
  }

  const top = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);

  const yLabels = top;
  const xLabels = GROUPS.map((g) => g.label);

  const sums: Record<string, number[]> = Object.fromEntries(
    yLabels.map((ex) => [ex, [0, 0, 0, 0]]),
  );
  const counts: Record<string, number[]> = Object.fromEntries(
    yLabels.map((ex) => [ex, [0, 0, 0, 0]]),
  );

  for (const e of entries) {
    if (!e.total || e.total <= 0) continue;
    const present = e.exposures ?? [];
    for (const ex of present) {
      if (!sums[ex]) continue;
      GROUPS.forEach((g, i) => {
        const share = (e[g.key] ?? 0) / e.total;
        sums[ex][i] += share;
        counts[ex][i] += 1;
      });
    }
  }

  const matrix = yLabels.map((ex) => {
    const row = sums[ex].map((sum, i) => {
      const c = counts[ex][i] || 1;
      return (sum / c) * 100;
    });
    const rowTotal = row.reduce((a, b) => a + b, 0) || 1;
    return row.map((v) => Math.round((v / rowTotal) * 100));
  });

  return {xLabels, yLabels, matrix};
}
