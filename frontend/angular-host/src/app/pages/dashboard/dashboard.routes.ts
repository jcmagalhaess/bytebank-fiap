import { Routes } from '@angular/router';
import { DashboardTabs } from './containers/dashboard-tabs/dashboard-tabs';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardTabs,
    children: [
      {
        path: '',
        loadComponent: () => import('./containers/dashboard/dashboard').then((c) => c.Dashboard),
      },
    ],
  },
];
