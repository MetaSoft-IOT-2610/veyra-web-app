import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ChatMessage implements BaseEntity {
  id: number;
  conversationId: number;
  senderUserId: number;
  content: string;
  createdAt: string;

  constructor(data: { id: number; conversationId: number; senderUserId: number; content: string; createdAt: string }) {
    this.id = data.id;
    this.conversationId = data.conversationId;
    this.senderUserId = data.senderUserId;
    this.content = data.content;
    this.createdAt = data.createdAt;
  }
}
