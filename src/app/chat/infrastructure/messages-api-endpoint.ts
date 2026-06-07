import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ChatMessageResponse } from './chat.response';
import { ChatMessage } from '../domain/model/chat-message.entity';

function messagesUrl(conversationId: number): string {
  return `${environment.platformProviderApiBaseUrl}${environment.platformProviderConversationMessagesEndpointPath.replace('{conversationId}', String(conversationId))}`;
}

export class MessagesApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  getMessages(conversationId: number, userId: number, page = 0, size = 50): Observable<ChatMessage[]> {
    const url = `${messagesUrl(conversationId)}?userId=${userId}&page=${page}&size=${size}`;
    return this.http.get<ChatMessageResponse[]>(url).pipe(
      map(list => list.map(r => new ChatMessage(r)).reverse()),
      catchError(this.handleError('Failed to load messages'))
    );
  }

  sendMessage(conversationId: number, senderUserId: number, content: string): Observable<ChatMessage> {
    return this.http
      .post<ChatMessageResponse>(messagesUrl(conversationId), { senderUserId, content })
      .pipe(
        map(r => new ChatMessage(r)),
        catchError(this.handleError('Failed to send message'))
      );
  }
}
