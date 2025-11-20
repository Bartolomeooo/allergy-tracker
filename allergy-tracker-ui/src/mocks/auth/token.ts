import type {TokenPayload} from '../../types/auth/token';

export function createAccessToken(params: {sub: string}): string {
  const payload: TokenPayload = {
    sub: params.sub,
    iat: Date.now() / 1000,
  };

  const header = btoa(JSON.stringify({alg: 'none', typ: 'JWT'}));
  const body = btoa(JSON.stringify(payload));

  return `${header}.${body}.sig`;
}

export function parseAccessToken(authHeader?: string): TokenPayload | null {
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const decoded = atob(parts[1]);

    const parsed: unknown = JSON.parse(decoded);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'sub' in parsed &&
      typeof (parsed as Record<string, unknown>).sub === 'string'
    ) {
      const rec = parsed as Record<string, unknown>;

      return {
        sub: rec.sub as string,
        iat: typeof rec.iat === 'number' ? rec.iat : Date.now() / 1000,
      };
    }

    return null;
  } catch {
    return null;
  }
}
