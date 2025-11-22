import type {RequestHandler} from 'msw';
import {loginHandler} from './auth/login';
import {registerHandler} from './auth/register';
import {refreshHandler} from './auth/refresh';
import {logoutHandler} from './auth/logout';

export const authHandlers: RequestHandler[] = [
  loginHandler,
  registerHandler,
  refreshHandler,
  logoutHandler,
];
