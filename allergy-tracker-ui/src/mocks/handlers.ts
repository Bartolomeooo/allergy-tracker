import {http, HttpResponse} from 'msw';
import entriesRaw from '../data/entries.json';
import exposureTypesRaw from '../data/exposure-types.json';
import type {Entry, NewEntry, ExposureType} from './types';

const entriesStore: Entry[] = entriesRaw as Entry[];
const exposureTypes: ExposureType[] = exposureTypesRaw as ExposureType[];

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
