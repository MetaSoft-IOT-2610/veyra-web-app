import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { environment } from '../../../environments/environment';

/**
 * API endpoint for registering and removing FCM push tokens.
 *
 * Follows the same pattern as SignInApiEndpoint and CreateAdministratorApiEndpoint:
 *  - Extends ErrorHandlingEnabledBaseType for consistent error handling.
 *  - URL constructed from environment config.
 *  - Instantiated by IamApi (not directly by DI).
 *
 * Backend contract (UserPushTokensController @ /api/v1/users/{userId}/push-tokens):
 *  POST   /api/v1/users/{userId}/push-tokens   body: { token, platform }  → 201
 *  DELETE /api/v1/users/{userId}/push-tokens   body: { token }            → 204
 *
 * The platform field is required by the backend (PushPlatform enum).
 * Web clients always send platform: 'WEB'.
 */
export class FcmTokenApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private readonly http: HttpClient) {
    super();
  }

  /**
   * Registers an FCM token for the given user.
   * Sends platform: 'WEB' — required by the backend PushPlatform enum.
   * @param userId - The authenticated user's ID.
   * @param token - The FCM registration token.
   */
  registerToken(userId: number, token: string): Observable<void> {
    const url = this.buildBaseUrl(userId);
    return this.http
      .post<void>(url, { token, platform: 'WEB' })
      .pipe(catchError(this.handleError('Failed to register FCM push token')));
  }

  /**
   * Removes an FCM token for the given user.
   * Uses DELETE with a JSON body — backend reads the token from the request body,
   * not from the URL path.
   * @param userId - The authenticated user's ID.
   * @param token - The FCM registration token to remove.
   */
  removeToken(userId: number, token: string): Observable<void> {
    const url = this.buildBaseUrl(userId);
    return this.http
      .delete<void>(url, { body: { token } })
      .pipe(catchError(this.handleError('Failed to remove FCM push token')));
  }

  private buildBaseUrl(userId: number): string {
    return `${environment.platformProviderApiBaseUrl}${environment.platformProviderFcmTokenEndpointPath}`.replace(
      '{userId}',
      String(userId)
    );
  }
}

