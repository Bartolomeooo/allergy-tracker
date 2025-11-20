import {http, HttpResponse} from 'msw';
import {clearRefreshCookie} from './utils';

export const logoutHandler = http.post('/auth/logout', () => {
  const headers = new Headers();
  headers.append('Set-Cookie', clearRefreshCookie());
  return HttpResponse.text('', {status: 204, headers});
});
