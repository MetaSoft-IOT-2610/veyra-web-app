import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { HttpClient } from '@angular/common/http';
import { SetPasswordCommand } from '../domain/model/set-password.command';
import { catchError, Observable } from 'rxjs';
import {SetPasswordCommandAssembler} from './set-password-command-assembler';

const setPasswordApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSetPasswordEndpointPath}`;

/**
 * API endpoint for handling set-password operations.
 */
export class SetPasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates a new SetPasswordApiEndpoint instance.
   * @param http - The HTTP client for making requests.
   * @param assembler - The assembler for converting between domain and API models.
   */
  constructor(private http: HttpClient, private assembler: SetPasswordCommandAssembler) {
    super();
  }

  /**
   * Sets the password for a relative account using the activation token.
   * @param command - The command containing the token and new password.
   * @returns An observable of void.
   */
  setPassword(command: SetPasswordCommand): Observable<void> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.post<void>(setPasswordApiEndpointUrl, request).pipe(
      catchError(this.handleError('Failed to set password'))
    );
  }
}
