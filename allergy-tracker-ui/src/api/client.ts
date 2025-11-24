import axios, {
  isAxiosError,
  type AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const LS_KEY = 'accessToken';

const RAW_USE_MOCKS = String(
  import.meta.env.VITE_USE_MOCKS ?? '',
).toLowerCase();
export const USE_MOCKS =
  RAW_USE_MOCKS === 'on' || RAW_USE_MOCKS === 'true' || RAW_USE_MOCKS === '1';

const RAW_API_URL = String(import.meta.env.VITE_API_URL ?? '').trim();

const baseURL = USE_MOCKS ? '/' : RAW_API_URL || 'http://localhost:8080';

const AUTH_ENDPOINTS_NO_REFRESH = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
];

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (t: string | null): void => {
    accessToken = t;
    if (t) localStorage.setItem(LS_KEY, t);
    else localStorage.removeItem(LS_KEY);
  },
  clear: (): void => {
    accessToken = null;
    localStorage.removeItem(LS_KEY);
  },
  bootstrap: (): void => {
    const fromLs = localStorage.getItem(LS_KEY);
    accessToken = fromLs || null;
  },
};

window.addEventListener('storage', (e) => {
  if (e.key === LS_KEY) {
    accessToken = e.newValue;
  }
});

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'},
});

function applyAuthHeader(
  headers: InternalAxiosRequestConfig['headers'] | undefined,
  value: string,
): AxiosHeaders {
  if (headers instanceof axios.AxiosHeaders) {
    headers.set('Authorization', value);
    return headers;
  }

  const axh = new axios.AxiosHeaders(headers);
  axh.set('Authorization', value);
  return axh;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = tokenStore.get();
  if (t) {
    config.headers = applyAuthHeader(config.headers, `Bearer ${t}`);
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  try {
    const {data}: AxiosResponse<{accessToken?: string | null}> =
      await api.post('/auth/refresh');

    const next: string | null = data?.accessToken ?? null;
    tokenStore.set(next);
    return next;
  } catch {
    tokenStore.clear();
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (err: unknown) => {
    if (!isAxiosError(err)) throw err;

    const original = err.config;
    const status = err.response?.status ?? 0;
    const url = original?.url ?? '';
    const hasAccessToken = !!tokenStore.get();

    const isAuthError = status === 401 || status === 403;

    if (
      !original ||
      !isAuthError ||
      original._retry ||
      AUTH_ENDPOINTS_NO_REFRESH.some((p) => url?.startsWith(p)) ||
      !hasAccessToken
    ) {
      throw err;
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }
    const newToken = await refreshPromise.finally(() => {
      refreshPromise = null;
    });

    if (newToken) {
      original.headers = applyAuthHeader(
        original.headers,
        `Bearer ${newToken}`,
      );
      return api(original);
    }

    throw err;
  },
);

export async function apiGet<T>(path: string): Promise<T> {
  const res = await api.get<T>(path);
  return res.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await api.post<T>(path, body);
  return res.data;
}

export async function apiDelete(path: string): Promise<void> {
  await api.delete(path);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await api.put<T>(path, body);
  return res.data;
}
