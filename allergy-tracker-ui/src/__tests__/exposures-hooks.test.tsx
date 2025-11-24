import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {useSaveExposureType} from '../hooks/useSaveExposureType';
import {useExposureMap} from '../hooks/useExposureMap';
import {apiGet, apiPost} from '../api/client';

vi.mock('../api/client', () => ({
  api: {post: vi.fn()},
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
  tokenStore: {get: vi.fn(), set: vi.fn(), clear: vi.fn()},
}));

type MockFn = ReturnType<typeof vi.fn>;

type SaveExposureTypeInput = Parameters<
    ReturnType<typeof useSaveExposureType>['save']
>[0];

describe('exposure hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useSaveExposureType sends POST and manages submitting flag', async () => {
    (apiPost as MockFn).mockResolvedValue({
      id: 'e1',
      name: 'Milk',
    });

    const {result} = renderHook(() => useSaveExposureType());

    expect(result.current.submitting).toBe(false);

    const payload: SaveExposureTypeInput = {name: 'Milk'};

    await act(async () => {
      const response = await result.current.save(payload);
      expect(response).toEqual({id: 'e1', name: 'Milk'});
    });

    expect(apiPost).toHaveBeenCalledExactlyOnceWith('/api/exposure-types', {
      name: 'Milk',
    });
    expect(result.current.submitting).toBe(false);
  });

  it('useExposureMap returns a name-to-id map based on API response', async () => {
    (apiGet as MockFn).mockResolvedValue([
      {id: '1', name: 'Pollen'},
      {id: '2', name: 'Milk'},
    ]);

    const {result} = renderHook(() => useExposureMap());

    await waitFor(() => {
      expect(result.current).toEqual({
        Pollen: '1',
        Milk: '2',
      });
    });
  });

  it('useExposureMap returns empty map when request fails', async () => {
    (apiGet as MockFn).mockRejectedValue(new Error('fail'));

    const {result} = renderHook(() => useExposureMap());

    await waitFor(() => {
      expect(result.current).toEqual({});
    });
  });
});
