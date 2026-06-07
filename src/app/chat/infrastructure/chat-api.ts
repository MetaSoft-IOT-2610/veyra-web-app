import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { FamiliarUsersApiEndpoint } from './familiar-users-api-endpoint';
import { ConversationsApiEndpoint } from './conversations-api-endpoint';
import { MessagesApiEndpoint } from './messages-api-endpoint';
import { Observable } from 'rxjs';
import { ChatContact } from '../domain/model/chat-contact.entity';
import { Conversation } from '../domain/model/conversation.entity';
import { ChatMessage } from '../domain/model/chat-message.entity';

@Injectable({ providedIn: 'root' })
export class ChatApi extends BaseApi {
  private readonly familiarUsersEndpoint: FamiliarUsersApiEndpoint;
  private readonly conversationsEndpoint: ConversationsApiEndpoint;
  private readonly messagesEndpoint: MessagesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.familiarUsersEndpoint = new FamiliarUsersApiEndpoint(http);
    this.conversationsEndpoint = new ConversationsApiEndpoint(http);
    this.messagesEndpoint = new MessagesApiEndpoint(http);
  }

  getFamiliarUsers(): Observable<ChatContact[]> {
    return this.familiarUsersEndpoint.getFamiliarUsers();
  }

  getOrCreateDirectConversation(adminUserId: number, familiarUserId: number): Observable<Conversation> {
    return this.conversationsEndpoint.getOrCreateDirectConversation(adminUserId, familiarUserId);
  }

  getUserConversations(userId: number): Observable<Conversation[]> {
    return this.conversationsEndpoint.getUserConversations(userId);
  }

  getMessages(conversationId: number, userId: number): Observable<ChatMessage[]> {
    return this.messagesEndpoint.getMessages(conversationId, userId);
  }

  sendMessage(conversationId: number, senderUserId: number, content: string): Observable<ChatMessage> {
    return this.messagesEndpoint.sendMessage(conversationId, senderUserId, content);
  }

  markAsRead(conversationId: number, userId: number): Observable<void> {
    return this.conversationsEndpoint.markAsRead(conversationId, userId);
  }
}
