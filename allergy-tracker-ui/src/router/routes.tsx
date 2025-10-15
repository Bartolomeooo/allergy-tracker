import {lazy} from 'react';
import type {RouteObject} from 'react-router-dom';
import {PATHS} from './paths';

const JournalPage = lazy(() => import('../pages/JournalPage'));

export const routes: RouteObject[] = [
  {path: PATHS.journal, element: <JournalPage />},
];
