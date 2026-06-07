import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Conversation implements BaseEntity {
  id: number;
  type: string;
  participantUserIds: number[];
  lastMessageAt: string | null;

  constructor(data: { id: number; type: string; participantUserIds: number[]; lastMessageAt: string | null }) {
    this.id = data.id;
    this.type = data.type;
    this.participantUserIds = data.participantUserIds;
    this.lastMessageAt = data.lastMessageAt;
  }
}
