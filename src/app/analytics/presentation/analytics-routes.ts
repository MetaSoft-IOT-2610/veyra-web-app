import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

const analyticsDashboard = () =>
  import('./views/analytics-dashboard/analytics-dashboard').then((m) => m.AnalyticsDashboard);

export const analyticsPaths = {
  dashboard: 'dashboard',
} as const;

export const analyticsNav = {
  dashboard: () => ['/analytics', analyticsPaths.dashboard],
} as const;

const analyticsRoutes: Routes = [
  definePageRoute({
    path: analyticsPaths.dashboard,
    name: 'analytics.dashboard',
    loadComponent: analyticsDashboard,
    page: {
      ...routePageKeys('analytics.dashboard'),
      showBackButton: false,
    },
  }),
];

export { analyticsRoutes };
