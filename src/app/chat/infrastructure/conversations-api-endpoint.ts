import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ConversationResponse } from './chat.response';
import { Conversation } from '../domain/model/conversation.entity';

const conversationsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderConversationsEndpointPath}`;

function userConversationsUrl(userId: number): string {
  return `${environment.platformProviderApiBaseUrl}${environment.platformProviderUserConversationsEndpointPath.replace('{userId}', String(userId))}`;
}

export class ConversationsApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  getOrCreateDirectConversation(adminUserId: number, familiarUserId: number): Observable<Conversation> {
    return this.http
      .post<ConversationResponse>(conversationsUrl, {
        participantUserIds: [adminUserId, familiarUserId],
        type: 'DIRECT',
      })
      .pipe(
        map(r => new Conversation({ id: r.id, type: r.type, participantUserIds: r.participantUserIds, lastMessageAt: r.lastMessageAt })),
        catchError(this.handleError('Failed to get or create conversation'))
      );
  }

  getUserConversations(userId: number): Observable<Conversation[]> {
    return this.http.get<ConversationResponse[]>(userConversationsUrl(userId)).pipe(
      map(list =>
        list.map(r => new Conversation({ id: r.id, type: r.type, participantUserIds: r.participantUserIds, lastMessageAt: r.lastMessageAt }))
      ),
      catchError(this.handleError('Failed to load conversations'))
    );
  }

  markAsRead(conversationId: number, userId: number): Observable<void> {
    const url = `${conversationsUrl}/${conversationId}/read?userId=${userId}`;
    return this.http.patch<void>(url, {}).pipe(
      catchError(this.handleError('Failed to mark conversation as read'))
    );
  }
}
