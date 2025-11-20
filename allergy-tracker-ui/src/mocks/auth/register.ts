import {http, HttpResponse} from 'msw';
import {authDatabase} from './database';
import {createAccessToken} from './token';
import {isRegisterBody, setRefreshCookie} from './utils';
import type {User} from '../../types/user';

export const registerHandler = http.post(
  '/auth/register',
  async ({request}) => {
    const body = await request.json();

    if (!isRegisterBody(body)) {
      return HttpResponse.json({message: 'Bad request'}, {status: 400});
    }

    const email = body.email.trim().toLowerCase();
    const exists = authDatabase.getUserByEmail(email);
    if (exists) {
      return HttpResponse.json(
        {message: 'Email already in use'},
        {status: 409},
      );
    }

    const id =
      globalThis.crypto?.randomUUID?.() ??
      `u-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const user: User = {id, email};
    authDatabase.addUser(user);

    const accessToken = createAccessToken({sub: user.id});
    const headers = new Headers();
    headers.append('Set-Cookie', setRefreshCookie(user.id));

    return HttpResponse.json(
      {accessToken, user},
      {
        status: 201,
        headers,
      },
    );
  },
);
