import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

const alertsList = () =>
  import('./views/alerts-list/alerts-list').then((m) => m.AlertsList);

export const alertsPaths = {
  list: '',
} as const;

export const alertsNav = {
  list: () => ['/alerts'],
} as const;

const alertsRoutes: Routes = [
  definePageRoute({
    path: alertsPaths.list,
    name: 'alerts.list',
    loadComponent: alertsList,
    page: {
      ...routePageKeys('alerts.list'),
      showBackButton: false,
    },
  }),
];

export { alertsRoutes };
