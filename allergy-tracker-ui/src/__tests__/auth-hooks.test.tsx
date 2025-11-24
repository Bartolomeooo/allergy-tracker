/* eslint-disable @typescript-eslint/unbound-method */

import {act, renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {createWrapper} from './test-utils';
import {PATHS} from '../router/paths';
import {fetchMe, useLogin, useLogout, useMe, useRegister,} from '../hooks/useAuth';
import {jwtDecode} from 'jwt-decode';
import {api, tokenStore} from '../api/client';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') =
      await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

vi.mock('../api/client', () => ({
  api: {
    post: vi.fn(),
  },
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
  tokenStore: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));

type MockFn = ReturnType<typeof vi.fn>;

describe('auth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchMe returns null when there is no token', () => {
    (tokenStore.get as MockFn).mockReturnValue(null);

    const result = fetchMe();

    expect(result).toBeNull();
  });

  it('fetchMe decodes token and returns user data', () => {
    (tokenStore.get as MockFn).mockReturnValue('jwt-token');
    (jwtDecode as MockFn).mockReturnValue({
      sub: 'user-id',
      email: 'user@example.com',
      iat: 0,
      exp: 999_999,
    });

    const result = fetchMe();

    expect(result).toEqual({
      user: {id: 'user-id', email: 'user@example.com'},
    });
  });

  it('useMe does not run the query when there is no token', async () => {
    (tokenStore.get as MockFn).mockReturnValue(null);

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useMe(), {wrapper: Wrapper});

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('useMe returns decoded user when token is present', async () => {
    (tokenStore.get as MockFn).mockReturnValue('jwt-token');
    (jwtDecode as MockFn).mockReturnValue({
      sub: 'user-id',
      email: 'user@example.com',
      iat: 0,
      exp: 999_999,
    });

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useMe(), {wrapper: Wrapper});

    await waitFor(() => {
      expect(result.current.data).toEqual({
        user: {id: 'user-id', email: 'user@example.com'},
      });
    });
  });

  it('useLogin stores token, updates me cache and navigates on success', async () => {
    (api.post as MockFn).mockResolvedValue({
      data: {accessToken: 'jwt-token'},
    });
    (jwtDecode as MockFn).mockReturnValue({
      sub: '42',
      email: 'user@example.com',
      iat: 0,
      exp: 999_999,
    });

    const {Wrapper, queryClient} = createWrapper();
    const {result} = renderHook(() => useLogin(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.mutateAsync({
        email: 'user@example.com',
        password: 'secret',
      });
    });

    expect(tokenStore.set).toHaveBeenCalledExactlyOnceWith('jwt-token');

    expect(queryClient.getQueryData(['me'])).toEqual({
      user: {id: '42', email: 'user@example.com'},
    });

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(PATHS.journal, {
      replace: true,
    });

    expect(result.current.errorMessage).toBeNull();
  });

  it('useLogin sets correct error message for 401', async () => {
    (api.post as MockFn).mockRejectedValue({
      isAxiosError: true,
      response: {status: 401, data: {}},
    });

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useLogin(), {wrapper: Wrapper});

    await act(async () => {
      await result.current
          .mutateAsync({email: 'x', password: 'y'})
          .catch(() => {
          });
    });

    expect(result.current.errorMessage).toBe('Nieprawidłowy email lub hasło.');
  });

  it('useRegister stores token, updates me cache and navigates on success', async () => {
    (api.post as MockFn).mockResolvedValue({
      data: {accessToken: 'register-token'},
    });
    (jwtDecode as MockFn).mockReturnValue({
      sub: '7',
      email: 'new@example.com',
      iat: 0,
      exp: 999_999,
    });

    const {Wrapper, queryClient} = createWrapper();
    const {result} = renderHook(() => useRegister(), {wrapper: Wrapper});

    await act(async () => {
      await result.current.mutateAsync({
        email: 'new@example.com',
        password: 'secret',
      });
    });

    expect(tokenStore.set).toHaveBeenCalledExactlyOnceWith('register-token');

    expect(queryClient.getQueryData(['me'])).toEqual({
      user: {id: '7', email: 'new@example.com'},
    });

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(PATHS.journal, {
      replace: true,
    });
  });

  it('useRegister sets correct error message for 409 conflict', async () => {
    (api.post as MockFn).mockRejectedValue({
      isAxiosError: true,
      response: {status: 409, data: {}},
    });

    const {Wrapper} = createWrapper();
    const {result} = renderHook(() => useRegister(), {wrapper: Wrapper});

    await act(async () => {
      await result.current
          .mutateAsync({email: 'dup@example.com', password: 'secret'})
          .catch(() => {
          });
    });

    expect(result.current.errorMessage).toBe(
        'Podany adres e-mail jest już zajęty.',
    );
  });

  it('useLogout clears token, clears cache and redirects to login', async () => {
    (api.post as MockFn).mockResolvedValue({});

    const {Wrapper, queryClient} = createWrapper();
    const {result} = renderHook(() => useLogout(), {wrapper: Wrapper});

    queryClient.setQueryData(['entries'], [{id: '1'}]);

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(api.post).toHaveBeenCalledExactlyOnceWith('/auth/logout', {});

    expect(tokenStore.clear).toHaveBeenCalledExactlyOnceWith();

    expect(queryClient.getQueryData(['entries'])).toBeUndefined();

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(PATHS.login, {
      replace: true,
    });
  });
});
