export interface FamiliarUserResponse {
  id: number;
  username: string;
  roles: string[];
}

export interface ConversationResponse {
  id: number;
  type: string;
  groupName: string | null;
  participantUserIds: number[];
  lastMessageAt: string | null;
}

export interface ChatMessageResponse {
  id: number;
  conversationId: number;
  senderUserId: number;
  content: string;
  createdAt: string;
}
