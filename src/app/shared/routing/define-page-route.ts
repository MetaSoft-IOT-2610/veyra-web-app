import { Route } from '@angular/router';
import { APP_DOCUMENT_TITLE_SUFFIX, AppRouteData, RoutePageData } from './route-page-data';

/**
 * Define una ruta lazy con metadatos de página para el toolbar.
 */
export function definePageRoute(options: {
  path: string;
  name: string;
  loadComponent: Route['loadComponent'];
  page: RoutePageData;
}): Route {
  const data: AppRouteData = {
    routeName: options.name,
    ...options.page,
  };

  return {
    path: options.path,
    loadComponent: options.loadComponent,
    title: `${options.page.title} | ${APP_DOCUMENT_TITLE_SUFFIX}`,
    data,
  };
}
