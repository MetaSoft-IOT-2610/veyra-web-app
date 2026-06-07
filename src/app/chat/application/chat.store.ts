import { computed, Injectable, signal } from '@angular/core';
import { ChatApi } from '../infrastructure/chat-api';
import { ChatWebsocketService } from '../infrastructure/chat-websocket.service';
import { ChatContact } from '../domain/model/chat-contact.entity';
import { Conversation } from '../domain/model/conversation.entity';
import { ChatMessage } from '../domain/model/chat-message.entity';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatStore {
  private readonly _contactsSignal = signal<ChatContact[]>([]);
  private readonly _selectedContactSignal = signal<ChatContact | null>(null);
  private readonly _conversationSignal = signal<Conversation | null>(null);
  private readonly _messagesSignal = signal<ChatMessage[]>([]);
  private readonly _searchQuerySignal = signal<string>('');
  private readonly _loadingContactsSignal = signal<boolean>(false);
  private readonly _loadingMessagesSignal = signal<boolean>(false);
  private readonly _sendingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly contacts = this._contactsSignal.asReadonly();
  readonly selectedContact = this._selectedContactSignal.asReadonly();
  readonly conversation = this._conversationSignal.asReadonly();
  readonly messages = this._messagesSignal.asReadonly();
  readonly searchQuery = this._searchQuerySignal.asReadonly();
  readonly loadingContacts = this._loadingContactsSignal.asReadonly();
  readonly loadingMessages = this._loadingMessagesSignal.asReadonly();
  readonly sending = this._sendingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  readonly filteredContacts = computed<ChatContact[]>(() => {
    const query = this._searchQuerySignal().trim().toLowerCase();
    if (!query) return this._contactsSignal();
    return this._contactsSignal().filter(c => c.username.toLowerCase().includes(query));
  });

  private wsSubscription: Subscription | null = null;

  constructor(
    private readonly chatApi: ChatApi,
    private readonly chatWs: ChatWebsocketService
  ) {}

  loadContacts(): void {
    this._loadingContactsSignal.set(true);
    this._errorSignal.set(null);
    this.chatApi.getFamiliarUsers().subscribe({
      next: contacts => {
        this._contactsSignal.set(contacts);
        this._loadingContactsSignal.set(false);
      },
      error: () => {
        this._errorSignal.set('chat.error-load-contacts');
        this._loadingContactsSignal.set(false);
      },
    });
  }

  selectContact(contact: ChatContact, currentUserId: number): void {
    this._selectedContactSignal.set(contact);
    this._messagesSignal.set([]);
    this._conversationSignal.set(null);
    this._loadingMessagesSignal.set(true);
    this._errorSignal.set(null);

    this.chatApi.getOrCreateDirectConversation(currentUserId, contact.id).subscribe({
      next: conversation => {
        this._conversationSignal.set(conversation);
        this.loadMessages(conversation.id, currentUserId);
        this.subscribeToConversation(conversation.id, currentUserId);
      },
      error: () => {
        this._errorSignal.set('chat.error-start-conversation');
        this._loadingMessagesSignal.set(false);
      },
    });
  }

  sendMessage(content: string, currentUserId: number): void {
    const conversation = this._conversationSignal();
    if (!conversation || !content.trim()) return;

    this._sendingSignal.set(true);
    this.chatApi.sendMessage(conversation.id, currentUserId, content.trim()).subscribe({
      next: () => {
        this._sendingSignal.set(false);
      },
      error: () => {
        this._errorSignal.set('chat.error-send-message');
        this._sendingSignal.set(false);
      },
    });
  }

  setSearchQuery(query: string): void {
    this._searchQuerySignal.set(query);
  }

  private loadMessages(conversationId: number, userId: number): void {
    this._loadingMessagesSignal.set(true);
    this.chatApi.getMessages(conversationId, userId).subscribe({
      next: messages => {
        this._messagesSignal.set(messages);
        this._loadingMessagesSignal.set(false);
        this.chatApi.markAsRead(conversationId, userId).subscribe();
      },
      error: () => {
        this._errorSignal.set('chat.error-load-messages');
        this._loadingMessagesSignal.set(false);
      },
    });
  }

  private subscribeToConversation(conversationId: number, currentUserId: number): void {
    this.wsSubscription?.unsubscribe();
    this.chatWs.connect();
    this.wsSubscription = this.chatWs.watchConversation$(conversationId).subscribe({
      next: message => {
        this._messagesSignal.update(msgs => {
          const alreadyExists = msgs.some(m => m.id === message.id);
          return alreadyExists ? msgs : [...msgs, message];
        });
        if (message.senderUserId !== currentUserId) {
          this.chatApi.markAsRead(conversationId, currentUserId).subscribe();
        }
      },
    });
  }

  cleanup(): void {
    this.wsSubscription?.unsubscribe();
    this.wsSubscription = null;
  }
}
