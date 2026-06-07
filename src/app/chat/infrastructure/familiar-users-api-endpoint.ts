import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { FamiliarUserResponse } from './chat.response';
import { ChatContact } from '../domain/model/chat-contact.entity';

const usersUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderUsersEndpointPath}`;

export class FamiliarUsersApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  getFamiliarUsers(): Observable<ChatContact[]> {
    return this.http.get<FamiliarUserResponse[]>(usersUrl).pipe(
      map(users =>
        users
          .filter(u => u.roles.includes('ROLE_FAMILIAR'))
          .map(u => new ChatContact({ id: u.id, username: u.username, roles: u.roles }))
      ),
      catchError(this.handleError('Failed to load familiar users'))
    );
  }
}
