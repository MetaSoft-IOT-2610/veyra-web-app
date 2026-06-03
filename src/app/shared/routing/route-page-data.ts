/**
 * Metadatos de página expuestos en `Route.data` para el toolbar y navegación.
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

export function isAppRouteData(data: unknown): data is AppRouteData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const record = data as Record<string, unknown>;
  return typeof record['title'] === 'string' && typeof record['module'] === 'string';
}
