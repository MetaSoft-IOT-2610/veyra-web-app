/**
 * Route configuration for the Activities bounded context.
 *
 * Exports:
 * - {@link activitiesRoutes} - Lazy-loaded route array consumed by the root router
 * - {@link activitiesPaths} - Typed path constants for type-safe URL construction
 * - {@link activitiesNav} - Factory functions for programmatic navigation
 *
 * Routes:
 * - `/activities`     → ActivityList  (list and manage all activities)
 * - `/activities/new` → ActivityForm  (create a new activity)
 */
import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const activityList = () =>
  import('./views/activity-list/activity-list').then((m) => m.ActivityList);

const activityForm = () =>
  import('./views/activity-form/activity-form').then((m) => m.ActivityForm);

/** Typed path constants for the Activities bounded context routes. */
export const activitiesPaths = {
  list: '',
  new: 'new',
} as const;

/** Factory functions for programmatic navigation within Activities. */
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
      title: 'Activities',
      module: 'Activities',
      description: 'Record and track resident care activities',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: activitiesPaths.new,
    name: 'activities.new',
    loadComponent: activityForm,
    page: {
      title: 'Log Activity',
      module: 'Activities',
      description: 'Register a new care activity for a resident',
      showBackButton: true,
    },
  }),
];

export { activitiesRoutes };
