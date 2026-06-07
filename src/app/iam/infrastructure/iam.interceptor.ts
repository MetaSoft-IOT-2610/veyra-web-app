import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * Lógica actual: solo adjunta `Authorization: Bearer` si `IamStore.currentToken()` devuelve un
 * string no vacío. No inspecciona respuestas; un 401 por JWT expirado llega igual al caller
 * (store/componente) sin tratamiento global.
 *
 * ---------------------------------------------------------------------------------------------
 * MEJORA — Sesión expirada: mensaje flotante + bloquear interacción hasta volver a iniciar sesión
 * ---------------------------------------------------------------------------------------------
 * 1) Interceptor funcional con `next(req).pipe(...)`:
 *    - `catchError` / `tap` sobre el observable de la petición.
 *    - Si `error instanceof HttpErrorResponse` y `error.status === 401` (y opcionalmente un
 *      cuerpo/código que distinga "token expirado" de "credenciales incorrectas"), delegar en
 *      un único punto (p. ej. `IamStore.handleSessionExpired(router)` o un `SessionExpiryService`).
 *
 * 2) Ese servicio / método debería:
 *    - Llamar a la misma limpieza que `signOut` (quitar token, userId, señales) pero sin enviar
 *      al usuario a `/home` si quieres forzar login: `router.navigate(['/iam/sign-in'], { replaceUrl: true })`.
 *    - Poner un `signal(true)` tipo `sessionExpiredOverlay` para que un componente raíz (p. ej.
 *      en `app.html` o dentro de `MainLayout`) muestre un `div` a pantalla completa con
 *      `pointer-events: all` y `z-index` alto, texto "Su sesión ha expirado" y un botón "Iniciar sesión".
 *    - Mostrar mensaje flotante: `MatSnackBar.open('Su sesión ha expirado', 'Cerrar', { duration: 6000 })`
 *      (importar `MatSnackBarModule` / `provideAnimations` si aún no están).
 *    - Evitar bucles: excluir del manejo 401 las URLs de login/refresh (`req.url.includes('/authentication/sign-in')`).
 *
 * 3) Bloquear clics en el resto de la app: el overlay a pantalla completa encima del `router-outlet`
 *    impide interactuar hasta que el usuario pulse el CTA que navega a sign-in (o hasta cerrar
 *    un `MatDialog` con `disableClose: true` que muestre el mismo mensaje).
 *
 * 4) Peticiones que no usan `HttpClient` (p. ej. `fetch` en payments) no pasan por aquí: repetir
 *    la misma política allí o unificar todo en `HttpClient`.
 */
const PUBLIC_URL_FRAGMENTS = [
  '/authentication/sign-in',
  '/authentication/sign-up',
  '/administrators',
];

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const iamStore = inject(IamStore);

  const isPublic = PUBLIC_URL_FRAGMENTS.some(fragment => req.url.includes(fragment));
  if (isPublic) return next(req);

  const token = iamStore.currentToken();

  if (token && token.length > 0) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }

  return next(req);
};
