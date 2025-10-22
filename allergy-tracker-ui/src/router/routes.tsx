import {lazy} from 'react';
import type {RouteObject} from 'react-router-dom';
import {PATHS} from './paths';
import Layout from '../layouts/Layout';

const JournalPage = lazy(() => import('../pages/JournalPage/JournalPage.tsx'));
const AddEntriesPage = lazy(
  () => import('../pages/AddEntriesPage/AddEntriesPage'),
);
const AddExposureTypePage = lazy(
  () => import('../pages/AddExposureTypePage/AddExposureTypePage'),
);

export const routes: RouteObject[] = [
  {
    path: PATHS.journal,
    element: <Layout />,
    children: [
      {index: true, element: <JournalPage />},
      {path: PATHS.addEntry, element: <AddEntriesPage />},
      {path: PATHS.addExposure, element: <AddExposureTypePage />},
    ],
  },
];
