/**
 * Metadatos de página expuestos en `Route.data` para el toolbar y navegación.
 * `title`, `module` y `description` son claves i18n (p. ej. `routes.nursing.residents.list.title`).
 */
export interface RoutePageData {
  title: string;
  module: string;
  description?: string;
  showBackButton: boolean;
}

export interface AppRouteData extends RoutePageData {
  routeName: string;
}

export const APP_DOCUMENT_TITLE_SUFFIX = 'Veyra';

/** Builds i18n keys for route toolbar metadata from the route `name`. */
export function routePageKeys(name: string): Pick<RoutePageData, 'title' | 'module' | 'description'> {
  return {
    title: `routes.${name}.title`,
    module: `routes.${name}.module`,
    description: `routes.${name}.description`,
  };
}

export function isAppRouteData(data: unknown): data is AppRouteData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const record = data as Record<string, unknown>;
  return typeof record['title'] === 'string' && typeof record['module'] === 'string';
}
