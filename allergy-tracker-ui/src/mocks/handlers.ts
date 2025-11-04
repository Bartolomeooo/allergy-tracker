import {http, HttpResponse} from 'msw';
import entriesRaw from './data/entries.json';
import exposureTypesRaw from './data/exposure-types.json';
import type {Entry, NewEntry, ExposureType} from './types';

const entriesStore: Entry[] = entriesRaw as Entry[];
const exposureTypes: ExposureType[] = exposureTypesRaw as ExposureType[];

const genId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const handlers = [
  // GET /api/exposure-types
  http.get('/api/exposure-types', () => HttpResponse.json(exposureTypes)),

  // GET /api/entries
  http.get('/api/entries', () => HttpResponse.json(entriesStore)),

  // POST /api/entries
  http.post('/api/entries', async ({request}) => {
    const body = (await request.json()) as NewEntry;
    const newEntry: Entry = {id: genId(), ...body};
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
      id: genId(),
      name,
      ...(description ? {description} : {}),
    };

    exposureTypes.unshift(newExposure);

    return HttpResponse.json(newExposure, {status: 201});
  }),

  // GET /api/exposure-types/:id
  http.get('/api/exposure-types/:id', ({params}) => {
    const {id} = params as {id: string};
    const item = exposureTypes.find((x) => x.id === id);
    if (!item) return new HttpResponse('Not Found', {status: 404});
    return HttpResponse.json(item);
  }),

  // DELETE /api/entries/:id
  http.delete('/api/entries/:id', ({params}) => {
    const {id} = params as {id: string};
    const idx = entriesStore.findIndex((x) => x.id === id);
    if (idx === -1) return new HttpResponse('Not Found', {status: 404});
    entriesStore.splice(idx, 1);
    return new HttpResponse(null, {status: 204});
  }),

  // GET /api/entries/:id
  http.get('/api/entries/:id', ({params}) => {
    const {id} = params as {id: string};
    const entry = entriesStore.find((x) => x.id === id);
    if (!entry) return new HttpResponse('Not Found', {status: 404});
    return HttpResponse.json(entry);
  }),

  // PUT /api/entries/:id
  http.put('/api/entries/:id', async ({params, request}) => {
    const {id} = params as {id: string};
    const idx = entriesStore.findIndex((x) => x.id === id);
    if (idx === -1) return new HttpResponse('Not Found', {status: 404});

    const body = (await request.json()) as NewEntry;

    if (!body.occurredOn) {
      return new HttpResponse('Missing "occurredOn"', {status: 400});
    }

    const updated: Entry = {id, ...body};
    entriesStore[idx] = updated;

    return HttpResponse.json(updated, {status: 200});
  }),
];
