import {serialize as serializeCookie, parse as parseCookie} from 'cookie';

export function setRefreshCookie(userId: string) {
  return serializeCookie('refreshToken', `rt-${userId}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearRefreshCookie() {
  return serializeCookie('refreshToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function readRefreshFrom(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const parsed = parseCookie(cookieHeader);
  return parsed.refreshToken;
}

export type LoginBody = {email: string; password?: string};
export type RegisterBody = {email: string; password?: string};

export function isLoginBody(x: unknown): x is LoginBody {
  if (typeof x !== 'object' || x === null) return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.email === 'string';
}

export function isRegisterBody(x: unknown): x is RegisterBody {
  if (typeof x !== 'object' || x === null) return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.email === 'string';
}
