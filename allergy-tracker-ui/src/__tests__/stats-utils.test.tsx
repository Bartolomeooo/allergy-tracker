import {describe, expect, it} from 'vitest';

import {getExposureSymptoms} from '../utils/stats/getExposureSymptoms';
import {getSymptomsShare} from '../utils/stats/getSymptomsShare';
import {getTopExposures} from '../utils/stats/getTopExposures';

import type {Entry} from '../mocks/types';

const makeEntry = (partial: Partial<Entry>): Entry => ({
    id: partial.id ?? '1',
    userId: partial.userId ?? 'u',
    exposures: partial.exposures ?? [],
    upperRespiratory: partial.upperRespiratory ?? 0,
    lowerRespiratory: partial.lowerRespiratory ?? 0,
    skin: partial.skin ?? 0,
    eyes: partial.eyes ?? 0,
    total: partial.total ?? 0,
    occurredOn: partial.occurredOn ?? '2025-01-01T12:00:00Z',
});

describe('getExposureSymptoms', () => {
    it('returns empty heatmap when entries array is empty', () => {
        const result = getExposureSymptoms([]);
        expect(result.yLabels).toEqual([]);
        expect(result.matrix).toEqual([]);
        expect(result.xLabels).toEqual([
            'Górne drogi oddechowe',
            'Dolne drogi oddechowe',
            'Skóra',
            'Oczy',
        ]);
    });

    it('ignores entries without exposures', () => {
        const entries: Entry[] = [
            makeEntry({
                exposures: [],
                upperRespiratory: 5,
                lowerRespiratory: 5,
                skin: 5,
                eyes: 5,
                total: 20,
            }),
        ];

        const result = getExposureSymptoms(entries);
        expect(result.yLabels).toEqual([]);
        expect(result.matrix).toEqual([]);
    });

    it('computes top exposures and builds heatmap matrix', () => {
        const entries: Entry[] = [
            makeEntry({
                exposures: ['Milk', 'Pollen'],
                upperRespiratory: 3,
                lowerRespiratory: 1,
                skin: 2,
                eyes: 4,
                total: 10,
            }),
            makeEntry({
                exposures: ['Milk'],
                upperRespiratory: 1,
                lowerRespiratory: 1,
                skin: 0,
                eyes: 1,
                total: 3,
            }),
        ];

        const result = getExposureSymptoms(entries);

        expect(result.yLabels).toEqual(['Milk', 'Pollen']);
        expect(result.matrix.length).toBe(2);
        expect(result.matrix[0].length).toBe(4);
        expect(result.matrix[1].length).toBe(4);

        result.matrix.forEach((row) => {
            row.forEach((cell) => {
                expect(cell).toBeGreaterThanOrEqual(0);
                expect(cell).toBeLessThanOrEqual(100);
            });
        });
    });

    it('treats missing symptom group values as zero', () => {
        const entries: Entry[] = [
            makeEntry({
                exposures: ['Milk'],
                upperRespiratory: 5,
                total: 5,
            }),
        ];

        const result = getExposureSymptoms(entries);
        const [upper, lower, skin, eyes] = result.matrix[0];

        expect(upper).toBe(100);
        expect(lower + skin + eyes).toBe(0);
    });

    it('skips entries with non-positive total when building shares', () => {
        const entries: Entry[] = [
            makeEntry({
                exposures: ['Milk'],
                upperRespiratory: 5,
                lowerRespiratory: 5,
                skin: 5,
                eyes: 5,
                total: 0,
            }),
            makeEntry({
                exposures: ['Milk'],
                upperRespiratory: 2,
                lowerRespiratory: 2,
                skin: 2,
                eyes: 2,
                total: 8,
            }),
        ];

        const result = getExposureSymptoms(entries);
        const sum = result.matrix[0].reduce((a, b) => a + b, 0);

        expect(sum).toBe(100);
    });

    it('respects topN option and ignores exposures outside of topN', () => {
        const entries: Entry[] = [
            makeEntry({exposures: ['A']}),
            makeEntry({exposures: ['B']}),
            makeEntry({exposures: ['C']}),
        ];

        const result = getExposureSymptoms(entries, {topN: 2});

        expect(result.yLabels.length).toBe(2);
        result.yLabels.forEach((label) => expect(['A', 'B', 'C']).toContain(label));
    });

    it('handles entries where exposures array is undefined', () => {
        const entries: Entry[] = [
            makeEntry({exposures: undefined}),
            makeEntry({exposures: ['Milk'], upperRespiratory: 2, total: 2}),
        ];

        const result = getExposureSymptoms(entries);
        expect(result.yLabels).toEqual(['Milk']);
    });
});

describe('getSymptomsShare', () => {
    it('returns empty array when entries are empty', () => {
        expect(getSymptomsShare([])).toEqual([]);
    });

    it('returns empty when total aggregated symptoms equals 0', () => {
        const entries: Entry[] = [
            makeEntry({
                upperRespiratory: 0,
                lowerRespiratory: 0,
                skin: 0,
                eyes: 0,
                total: 0,
            }),
        ];

        expect(getSymptomsShare(entries)).toEqual([]);
    });

    it('computes aggregated symptom shares', () => {
        const entries: Entry[] = [
            makeEntry({
                upperRespiratory: 3,
                lowerRespiratory: 1,
                skin: 2,
                eyes: 4,
                total: 10,
            }),
            makeEntry({
                upperRespiratory: 1,
                lowerRespiratory: 2,
                skin: 0,
                eyes: 1,
                total: 5,
            }),
        ];

        const result = getSymptomsShare(entries);

        expect(result.map((d) => d.key)).toEqual([
            'upperRespiratory',
            'lowerRespiratory',
            'skin',
            'eyes',
        ]);

        const upper = result.find((d) => d.key === 'upperRespiratory')!;
        expect(upper.value).toBe(4);
    });

    it('filters out categories with zero value', () => {
        const entries: Entry[] = [
            makeEntry({
                upperRespiratory: 5,
                lowerRespiratory: 0,
                skin: 0,
                eyes: 1,
                total: 6,
            }),
        ];

        const result = getSymptomsShare(entries);

        const keys = result.map((d) => d.key);
        expect(keys).toContain('upperRespiratory');
        expect(keys).toContain('eyes');
        expect(keys).not.toContain('lowerRespiratory');
        expect(keys).not.toContain('skin');
    });

    it('treats missing fields as zero and still uses total for guard', () => {
        const entries: Entry[] = [makeEntry({total: 10})];

        const result = getSymptomsShare(entries);
        expect(result).toEqual([]);
    });
});

describe('getTopExposures', () => {
    it('returns empty array when no entries', () => {
        expect(getTopExposures([])).toEqual([]);
    });

    it('returns exposures sorted by distinct day count', () => {
        const entries: Entry[] = [
            makeEntry({
                occurredOn: '2025-01-01T00:00:00Z',
                exposures: ['Milk', 'Pollen'],
            }),
            makeEntry({
                occurredOn: '2025-01-02T00:00:00Z',
                exposures: ['Milk'],
            }),
            makeEntry({
                occurredOn: '2025-01-02T00:00:00Z',
                exposures: ['Dust'],
            }),
        ];

        expect(getTopExposures(entries)).toEqual([
            {name: 'Milk', days: 2},
            {name: 'Pollen', days: 1},
            {name: 'Dust', days: 1},
        ]);
    });

    it('counts each exposure only once per day', () => {
        const entries: Entry[] = [
            makeEntry({
                occurredOn: '2025-01-01T10:00:00Z',
                exposures: ['Milk'],
            }),
            makeEntry({
                occurredOn: '2025-01-01T18:00:00Z',
                exposures: ['Milk'],
            }),
            makeEntry({
                occurredOn: '2025-01-02T12:00:00Z',
                exposures: ['Milk'],
            }),
        ];

        expect(getTopExposures(entries, {topN: 1})).toEqual([
            {name: 'Milk', days: 2},
        ]);
    });

    it('ignores entries with empty exposures array', () => {
        const entries: Entry[] = [
            makeEntry({
                occurredOn: '2025-01-01T00:00:00Z',
                exposures: [],
            }),
            makeEntry({
                occurredOn: '2025-01-01T00:00:00Z',
                exposures: ['Pollen'],
            }),
        ];

        expect(getTopExposures(entries)).toEqual([{name: 'Pollen', days: 1}]);
    });

    it('applies topN limit', () => {
        const entries: Entry[] = [
            makeEntry({occurredOn: '2025-01-01T00:00:00Z', exposures: ['A']}),
            makeEntry({occurredOn: '2025-01-02T00:00:00Z', exposures: ['B']}),
            makeEntry({occurredOn: '2025-01-03T00:00:00Z', exposures: ['C']}),
        ];

        expect(getTopExposures(entries, {topN: 2}).length).toBe(2);
    });
});
