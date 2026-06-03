import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

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
      title: 'Tablero',
      module: 'Analítica',
      description: 'Indicadores y métricas de la residencia',
      showBackButton: false,
    },
  }),
];

export { analyticsRoutes };
