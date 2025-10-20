import {lazy} from 'react';
import type {RouteObject} from 'react-router-dom';
import {PATHS} from './paths';
import Layout from '../layouts/Layout';

const JournalPage = lazy(() => import('../pages/JournalPage'));
const AddEntriesPage = lazy(
  () => import('../pages/AddEntriesPage/AddEntriesPage.tsx'),
);

export const routes: RouteObject[] = [
  {
    path: PATHS.journal,
    element: <Layout />,
    children: [
      {index: true, element: <JournalPage />},
      {path: PATHS.addEntry, element: <AddEntriesPage />},
    ],
  },
];
