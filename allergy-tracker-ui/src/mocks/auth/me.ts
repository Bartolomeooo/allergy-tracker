import {http, HttpResponse} from 'msw';
import {authDatabase} from './database';
import {requireAuth} from './requireAuth';

export const meHandler = http.get('/me', ({request}) => {
  const auth = requireAuth(request);

  if (auth instanceof HttpResponse) {
    return auth;
  }

  const user = authDatabase.getUserById(auth.sub);
  if (!user) {
    return HttpResponse.json({message: 'Not found'}, {status: 404});
  }

  return HttpResponse.json({user}, {status: 200});
});
