import { Routes } from '@angular/router';

const alertsList = () =>
  import('./views/alerts-list/alerts-list').then(m => m.AlertsList);

const baseTitle = 'Veyra';
const alertsRoutes: Routes = [
  { path: '', loadComponent: alertsList, title: `Alerts | ${baseTitle}` },
];

export { alertsRoutes };
