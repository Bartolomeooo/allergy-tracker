import {Suspense} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {routes} from './routes.tsx';
import {LinearProgress} from '@mui/material';

const router = createBrowserRouter(routes);

export default function AppRouter() {
  return (
    <Suspense fallback={<LinearProgress />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
