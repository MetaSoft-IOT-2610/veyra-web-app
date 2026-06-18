/**
 * Route configuration for the Activities bounded context.
 *
 * Exports:
 * - {@link activitiesRoutes} - Lazy-loaded route array consumed by the root router
 * - {@link activitiesPaths} - Typed path constants for type-safe URL construction
 * - {@link activitiesNav} - Factory functions for programmatic navigation
 *
 * Routes:
 * - `/activities` → ActivityList (list and manage all activities via inline modals)
 */
import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const activityList = () =>
  import('./views/activity-list/activity-list').then((m) => m.ActivityList);

/** Typed path constants for the Activities bounded context routes. */
export const activitiesPaths = {
  list: '',
} as const;

/** Factory functions for programmatic navigation within Activities. */
export const activitiesNav = {
  list: () => ['/activities'],
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
];

export { activitiesRoutes };
