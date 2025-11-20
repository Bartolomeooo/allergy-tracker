import {http, HttpResponse} from 'msw';
import {authDatabase} from './database';
import {createAccessToken} from './token';
import {readRefreshFrom} from './utils';

export const refreshHandler = http.post('/auth/refresh', ({request}) => {
  const rt = readRefreshFrom(request);

  if (!rt) {
    return HttpResponse.json({message: 'No refresh token'}, {status: 401});
  }

  const userId = rt.replace(/^rt-/, '');
  const user = authDatabase.getUserById(userId);
  if (!user) {
    return HttpResponse.json({message: 'Invalid refresh'}, {status: 401});
  }

  const accessToken = createAccessToken({sub: user.id});
  return HttpResponse.json({accessToken}, {status: 200});
});
