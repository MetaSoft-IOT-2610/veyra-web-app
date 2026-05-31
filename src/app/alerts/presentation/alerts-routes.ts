import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

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
      title: 'Alertas',
      module: 'Alertas',
      description: 'Notificaciones y eventos importantes',
      showBackButton: false,
    },
  }),
];

export { alertsRoutes };
