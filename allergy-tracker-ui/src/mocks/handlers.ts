import {http, HttpResponse} from 'msw';
import entriesRaw from './data/entries.json';
import exposureTypesRaw from './data/exposure-types.json';
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

  // POST /api/exposure-types
  http.post('/api/exposure-types', async ({request}) => {
    const body = (await request.json()) as Partial<ExposureType> | undefined;

    const name = body?.name?.toString().trim();
    if (!name) {
      return new HttpResponse('Missing "name"', {status: 400});
    }

    const description = body?.description?.toString().trim() || undefined;

    const newExposure: ExposureType = {
      id: Date.now(),
      name,
      ...(description ? {description} : {}),
    };

    exposureTypes.unshift(newExposure);

    return HttpResponse.json(newExposure, {status: 201});
  }),
];
