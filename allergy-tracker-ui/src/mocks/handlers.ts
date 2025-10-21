import {http, HttpResponse} from 'msw';
import entriesRaw from '../data/entries.json';
import exposureTypes from '../data/exposure-types.json';
import type {Entry, NewEntry} from './types';

const toEntry = (e: any): Entry => ({
  id: e.id,
  occurredOn: e.occurredOn,
  upperRespiratory: e.upperRespiratory,
  lowerRespiratory: e.lowerRespiratory,
  skin: e.skin,
  eyes: e.eyes,
  total: e.total,
  exposures: e.exposures,
  note: e.note ?? undefined,
});

let entriesStore: Entry[] = (entriesRaw as any[]).map(toEntry);

export const handlers = [
  // GET /api/exposure-types
  http.get('/api/exposure-types', () => HttpResponse.json(exposureTypes)),

  // GET /api/entries
  http.get('/api/entries', () => HttpResponse.json(entriesStore)),

  // POST /api/entries
  http.post('/api/entries', async ({request}) => {
    const body = (await request.json()) as NewEntry;
    const newEntry: Entry = {id: Date.now(), ...body};
    entriesStore.unshift(newEntry);
    return HttpResponse.json(newEntry, {status: 201});
  }),
];
