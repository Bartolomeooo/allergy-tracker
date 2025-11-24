import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {createWrapper} from './test-utils';
import {useEntries} from '../hooks/useEntries';
import {useDeleteEntry} from '../hooks/useDeleteEntry';
import {useSaveEntry} from '../hooks/useSaveEntry';
import {useUpdateEntry} from '../hooks/useUpdateEntry';
import {apiDelete, apiGet, apiPost, apiPut} from '../api/client';

vi.mock('../api/client', () => ({
  api: {post: vi.fn()},
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
  tokenStore: {get: vi.fn(), set: vi.fn(), clear: vi.fn()},
}));

type MockFn = ReturnType<typeof vi.fn>;

type TestEntry = {
  id: string;
  userId: string;
  note: string;
};

type SaveEntryInput = Parameters<ReturnType<typeof useSaveEntry>['save']>[0];

type UpdateEntryInput = Parameters<
    ReturnType<typeof useUpdateEntry>['update']
>[0];

if (!globalThis.crypto) {
  globalThis.crypto = {} as Crypto;
}
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: () => 'temp-id',
  configurable: true,
});

describe('entries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useEntries returns data from the API', async () => {
    (apiGet as MockFn).mockResolvedValue([
      {id: '1', userId: 'u1', note: 'a'},
      {id: '2', userId: 'u1', note: 'b'},
    ]);

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useEntries(), {wrapper: Wrapper});

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toHaveLength(2);
      expect(result.current.error).toBeNull();
    });
  });

  it('useEntries exposes error message when the query fails', async () => {
    (apiGet as MockFn).mockRejectedValue(new Error('boom'));

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useEntries(), {wrapper: Wrapper});

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('boom');
    });
  });

  it('useDeleteEntry performs optimistic removal and calls API', async () => {
    (apiDelete as MockFn).mockResolvedValue(undefined);

    const {Wrapper, queryClient} = createWrapper();

    queryClient.setQueryData<TestEntry[]>(
        ['entries'],
        [
          {id: '1', userId: 'u', note: 'a'},
          {id: '2', userId: 'u', note: 'b'},
        ],
    );

    const {result} = renderHook(() => useDeleteEntry(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.deleteEntry('1');
    });

    const entries = queryClient.getQueryData<TestEntry[]>(['entries'])!;
    expect(entries.map((e) => e.id)).toEqual(['2']);
    expect(apiDelete).toHaveBeenCalledExactlyOnceWith('/api/entries/1');
  });

  it('useDeleteEntry rolls back cache on error', async () => {
    (apiDelete as MockFn).mockRejectedValue(new Error('fail'));

    const {Wrapper, queryClient} = createWrapper();
    const initial: TestEntry[] = [
      {id: '1', userId: 'u', note: 'a'},
      {id: '2', userId: 'u', note: 'b'},
    ];
    queryClient.setQueryData<TestEntry[]>(['entries'], initial);

    const {result} = renderHook(() => useDeleteEntry(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.deleteEntry('1').catch(() => {
      });
    });

    const entries = queryClient.getQueryData<TestEntry[]>(['entries']);
    expect(entries).toEqual(initial);
  });

  it('useSaveEntry adds entry optimistically and replaces it with server result on success', async () => {
    (apiPost as MockFn).mockResolvedValue({
      id: 'real-id',
      userId: 'u1',
      note: 'saved',
    });

    const {Wrapper, queryClient} = createWrapper();
    const {result} = renderHook(() => useSaveEntry(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.save({
        userId: 'u1',
        note: 'saved',
      } as unknown as SaveEntryInput);
    });

    const entries = queryClient.getQueryData<TestEntry[]>(['entries'])!;
    expect(entries[0].id).toBe('real-id');
  });

  it('useSaveEntry restores previous cache on error', async () => {
    (apiPost as MockFn).mockRejectedValue(new Error('fail'));

    const {Wrapper, queryClient} = createWrapper();
    const initial: TestEntry[] = [{id: '1', userId: 'u', note: 'a'}];
    queryClient.setQueryData<TestEntry[]>(['entries'], initial);

    const {result} = renderHook(() => useSaveEntry(), {wrapper: Wrapper});

    await act(async () => {
      await result.current
          .save({
            userId: 'u',
            note: 'x',
          } as unknown as SaveEntryInput)
          .catch(() => {
          });
    });

    const entries = queryClient.getQueryData<TestEntry[]>(['entries']);
    expect(entries).toEqual(initial);
  });

  it('useUpdateEntry performs optimistic update and syncs with server result', async () => {
    (apiPut as MockFn).mockResolvedValue({
      id: '1',
      userId: 'u',
      note: 'server-updated',
    });

    const {Wrapper, queryClient} = createWrapper();
    queryClient.setQueryData<TestEntry[]>(
        ['entries'],
        [{id: '1', userId: 'u', note: 'old'}],
    );

    const {result} = renderHook(() => useUpdateEntry(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.update({
        id: '1',
        body: {note: 'client-updated'} as unknown as UpdateEntryInput['body'],
      });
    });

    const entries = queryClient.getQueryData<TestEntry[]>(['entries'])!;
    expect(entries[0].note).toBe('server-updated');
    expect(queryClient.getQueryData(['entry', '1'])).toEqual({
      id: '1',
      userId: 'u',
      note: 'server-updated',
    });
  });
});
