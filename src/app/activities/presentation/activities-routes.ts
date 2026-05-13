import { Routes } from '@angular/router';

const activityList = () =>
  import('./views/activity-list/activity-list').then(m => m.ActivityList);

const activityForm = () =>
  import('./views/activity-form/activity-form').then(m => m.ActivityForm);

const baseTitle = 'Veyra';
const activitiesRoutes: Routes = [
  { path: '', loadComponent: activityList, title: `Activities | ${baseTitle}` },
  { path: 'new', loadComponent: activityForm, title: `Log Activity | ${baseTitle}` }
];

export { activitiesRoutes };
