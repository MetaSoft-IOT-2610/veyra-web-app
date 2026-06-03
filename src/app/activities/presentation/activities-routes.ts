import { Routes } from '@angular/router';

const activityList = () =>
  import('./views/activity-list/activity-list').then(m => m.ActivityList);

const baseTitle = 'Veyra';
const activitiesRoutes: Routes = [
  { path: '', loadComponent: activityList, title: `Activities | ${baseTitle}` },
];

export { activitiesRoutes };
