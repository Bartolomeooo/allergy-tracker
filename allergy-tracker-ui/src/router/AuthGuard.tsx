import {Navigate, Outlet} from 'react-router-dom';
import {PATHS} from './paths';
import {useMe} from '../hooks/useAuth';
import {tokenStore} from '../api/client';
import {Typography} from '@mui/material';

export default function AuthGuard() {
  const hasToken = !!tokenStore.get();
  const {data, isLoading} = useMe();

  if (!hasToken) {
    return <Navigate to={PATHS.login} replace />;
  }

  if (isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  if (!data?.user) {
    return <Navigate to={PATHS.login} replace />;
  }

  return <Outlet />;
}
