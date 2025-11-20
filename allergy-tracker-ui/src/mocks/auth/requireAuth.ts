import {HttpResponse} from 'msw';
import {parseAccessToken} from './token';

export function requireAuth(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const payload = parseAccessToken(authHeader);

  if (!payload) {
    return HttpResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  return payload;
}
