import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it,} from 'vitest';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import axios from 'axios';

// @ts-expect-error internal axios adapter
import httpAdapter from 'axios/lib/adapters/http.js';

import {api, apiDelete, apiGet, apiPost, apiPut, tokenStore,} from '../api/client';

const API_BASE = 'http://localhost:8080';

let refreshCounter = 0;

type AxiosAdapter = NonNullable<(typeof axios.defaults)['adapter']>;

const httpTestAdapter = httpAdapter as AxiosAdapter;

const server = setupServer(
    http.get(`${API_BASE}/api/test`, () => {
      return HttpResponse.json({ok: true});
    }),

    http.post(`${API_BASE}/api/post`, async ({request}) => {
      const body = await request.json();
      return HttpResponse.json({received: body});
    }),

    http.put(`${API_BASE}/api/put`, async ({request}) => {
      const body = await request.json();
      return HttpResponse.json({updated: body});
    }),

    http.delete(`${API_BASE}/api/delete`, () =>
        HttpResponse.json({deleted: true}),
    ),

    http.get(`${API_BASE}/protected`, ({request}) => {
      const auth = request.headers.get('authorization');

      if (auth === 'Bearer NEW_TOKEN') {
        return HttpResponse.json({authorized: true});
      }
      return HttpResponse.json({error: 'unauthorized'}, {status: 401});
    }),

    http.post(`${API_BASE}/auth/refresh`, () => {
      refreshCounter++;
      return HttpResponse.json({accessToken: 'NEW_TOKEN'});
    }),

    http.post(`${API_BASE}/auth/logout`, () => {
      return HttpResponse.json({loggedOut: true});
    }),
);

beforeAll(() => {
  axios.defaults.adapter = httpTestAdapter;
  api.defaults.adapter = httpTestAdapter;
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  refreshCounter = 0;
  tokenStore.clear();
  tokenStore.set('OLD_TOKEN');
});

afterEach(() => {
  server.resetHandlers();
});

describe('API Client (MSW integration)', () => {
  it('adds Authorization header when token exists', async () => {
    let receivedAuth: string | null = null;

    server.use(
        http.get(`${API_BASE}/needs-auth`, ({request}) => {
          receivedAuth = request.headers.get('authorization');
          return HttpResponse.json({ok: true});
        }),
    );

    await apiGet('/needs-auth');

    expect(receivedAuth).toBe('Bearer OLD_TOKEN');
  });

  it('refreshes token on 401 and retries the request', async () => {
    const res = await apiGet('/protected');

    expect(refreshCounter).toBe(1);
    expect(res).toEqual({authorized: true});
    expect(tokenStore.get()).toBe('NEW_TOKEN');
  });

  it('does NOT refresh on second 401 retry attempt', async () => {
    server.use(
        http.get(`${API_BASE}/fail-twice`, () =>
            HttpResponse.json({error: 'x'}, {status: 401}),
        ),
    );

    await expect(apiGet('/fail-twice')).rejects.toThrow();

    expect(refreshCounter).toBe(1);
  });

  it('does NOT refresh on /auth/login or /auth/register errors', async () => {
    server.use(
        http.post(`${API_BASE}/auth/login`, () =>
            HttpResponse.json({err: 'bad'}, {status: 401}),
        ),
    );

    await expect(apiPost('/auth/login', {})).rejects.toThrow();
    expect(refreshCounter).toBe(0);
  });

  it('clears token and calls logout when refresh fails', async () => {
    server.use(
        http.get(`${API_BASE}/boom401`, () =>
            HttpResponse.json({}, {status: 401}),
        ),
        http.post(`${API_BASE}/auth/refresh`, () =>
            HttpResponse.json({}, {status: 500}),
        ),
        http.post(`${API_BASE}/auth/logout`, () =>
            HttpResponse.json({loggedOut: true}),
        ),
    );

    await expect(apiGet('/boom401')).rejects.toThrow();
    expect(tokenStore.get()).toBeNull();
  });

  it('shares a single refreshPromise between multiple failing requests', async () => {
    server.use(
        http.get(`${API_BASE}/batch`, ({request}) => {
          const auth = request.headers.get('authorization');
          if (auth === 'Bearer NEW_TOKEN') {
            return HttpResponse.json({ok: true});
          }
          return HttpResponse.json({}, {status: 401});
        }),
    );

    const req1 = apiGet('/batch');
    const req2 = apiGet('/batch');
    const req3 = apiGet('/batch');

    const results = await Promise.all([req1, req2, req3]);

    expect(results).toEqual([{ok: true}, {ok: true}, {ok: true}]);
    expect(refreshCounter).toBe(1);
  });

  it('apiGet returns response.data', async () => {
    const r = await apiGet('/api/test');
    expect(r).toEqual({ok: true});
  });

  it('apiPost returns response.data', async () => {
    const r = await apiPost('/api/post', {x: 123});
    expect(r).toEqual({received: {x: 123}});
  });

  it('apiPut returns response.data', async () => {
    const r = await apiPut('/api/put', {y: 5});
    expect(r).toEqual({updated: {y: 5}});
  });

  it('apiDelete succeeds', async () => {
    await expect(apiDelete('/api/delete')).resolves.not.toThrow();
  });
});
