import {lazy} from 'react';
import type {RouteObject} from 'react-router-dom';
import {PATHS} from './paths';
import Layout from '../layouts/Layout';
import AuthGuard from './AuthGuard';
import RedirectIfAuthed from './RedirectIfAuthed';

const JournalPage = lazy(() => import('../pages/JournalPage/JournalPage'));
const AddEntriesPage = lazy(
  () => import('../pages/AddEntriesPage/AddEntriesPage'),
);
const AddExposureTypePage = lazy(
  () => import('../pages/AddExposureTypePage/AddExposureTypePage'),
);
const StatsPage = lazy(() => import('../pages/StatsPage/StatsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));

export const routes: RouteObject[] = [
  {
    path: PATHS.login,
    element: (
      <RedirectIfAuthed>
        <LoginPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: PATHS.register,
    element: (
      <RedirectIfAuthed>
        <RegisterPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: PATHS.journal,
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          {index: true, element: <JournalPage />},
          {path: PATHS.addEntry, element: <AddEntriesPage />},
          {path: PATHS.addExposure, element: <AddExposureTypePage />},
          {path: PATHS.stats, element: <StatsPage />},
        ],
      },
    ],
  },
];
