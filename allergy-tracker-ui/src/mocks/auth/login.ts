import {http, HttpResponse} from 'msw';
import {authDatabase} from './database';
import {createAccessToken} from './token';
import {isLoginBody, setRefreshCookie} from './utils';

export const loginHandler = http.post('/auth/login', async ({request}) => {
  const body = await request.json();

  if (!isLoginBody(body)) {
    return HttpResponse.json({message: 'Bad request'}, {status: 400});
  }
  const email = body.email.trim().toLowerCase();
  const user = authDatabase.getUserByEmail(email);
  if (!user) {
    return HttpResponse.json({message: 'Invalid credentials'}, {status: 401});
  }

  const accessToken = createAccessToken({sub: user.id});
  const headers = new Headers();
  headers.append('Set-Cookie', setRefreshCookie(user.id));

  return HttpResponse.json(
    {accessToken, user},
    {
      status: 200,
      headers,
    },
  );
});
