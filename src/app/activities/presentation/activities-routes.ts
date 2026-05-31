import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const activityList = () =>
  import('./views/activity-list/activity-list').then((m) => m.ActivityList);

const activityForm = () =>
  import('./views/activity-form/activity-form').then((m) => m.ActivityForm);

export const activitiesPaths = {
  list: '',
  new: 'new',
} as const;

export const activitiesNav = {
  list: () => ['/activities'],
  new: () => ['/activities', activitiesPaths.new],
} as const;

const activitiesRoutes: Routes = [
  definePageRoute({
    path: activitiesPaths.list,
    name: 'activities.list',
    loadComponent: activityList,
    page: {
      title: 'Actividades',
      module: 'Actividades',
      description: 'Registro y seguimiento de actividades',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: activitiesPaths.new,
    name: 'activities.new',
    loadComponent: activityForm,
    page: {
      title: 'Registrar actividad',
      module: 'Actividades',
      description: 'Anota una nueva actividad realizada',
      showBackButton: true,
    },
  }),
];

export { activitiesRoutes };
