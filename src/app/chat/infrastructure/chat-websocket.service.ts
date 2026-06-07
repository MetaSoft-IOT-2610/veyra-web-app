import { Injectable, OnDestroy } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../domain/model/chat-message.entity';

@Injectable({ providedIn: 'root' })
export class ChatWebsocketService implements OnDestroy {
  private stomp = new RxStomp();
  private connected = false;

  connect(): void {
    if (this.connected) return;
    this.stomp.configure({
      brokerURL: environment.platformProviderWsUrl,
      reconnectDelay: 5000,
    });
    this.stomp.activate();
    this.connected = true;
  }

  watchConversation$(conversationId: number): Observable<ChatMessage> {
    const topic = `${environment.platformProviderWsChatTopicPath}/${conversationId}`;
    return this.stomp.watch(topic).pipe(
      map(msg => {
        const raw = JSON.parse(msg.body);
        return new ChatMessage({
          id: raw.id,
          conversationId: raw.conversationId,
          senderUserId: raw.senderUserId,
          content: raw.content,
          createdAt: raw.createdAt,
        });
      })
    );
  }

  async disconnect(): Promise<void> {
    await this.stomp.deactivate();
    this.connected = false;
  }

  ngOnDestroy(): void {
    this.disconnect().catch(err => console.error('ChatWebsocket disconnect error:', err));
  }
}
