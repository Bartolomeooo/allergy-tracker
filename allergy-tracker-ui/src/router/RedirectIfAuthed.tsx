import type {PropsWithChildren} from 'react';
import {Navigate} from 'react-router-dom';
import {PATHS} from './paths';
import {tokenStore} from '../api/client';

export default function RedirectIfAuthed({children}: PropsWithChildren) {
  const hasToken = !!tokenStore.get();
  if (hasToken) {
    return <Navigate to={PATHS.journal} replace />;
  }
  return <>{children}</>;
}
