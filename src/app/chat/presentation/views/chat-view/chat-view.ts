import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { ChatStore } from '../../../application/chat.store';
import { ChatContact } from '../../../domain/model/chat-contact.entity';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './chat-view.html',
  styleUrls: ['./chat-view.css'],
})
export class ChatView implements OnInit, OnDestroy {
  protected readonly iamStore: IamStore = inject(IamStore);
  protected readonly store: ChatStore = inject(ChatStore);

  protected messageText = signal<string>('');

  ngOnInit(): void {
    this.store.loadContacts();
  }

  ngOnDestroy(): void {
    this.store.cleanup();
  }

  protected selectContact(contact: ChatContact): void {
    const userId = this.iamStore.currentUserId();
    if (userId) {
      this.store.selectContact(contact, userId);
    }
  }

  protected sendMessage(): void {
    const text = this.messageText();
    if (!text.trim()) return;
    const userId = this.iamStore.currentUserId();
    if (userId) {
      this.store.sendMessage(text, userId);
      this.messageText.set('');
    }
  }

  protected onSearchChange(value: string): void {
    this.store.setSearchQuery(value);
  }

  protected isOwnMessage(senderUserId: number): boolean {
    return senderUserId === this.iamStore.currentUserId();
  }

  protected isSelected(contact: ChatContact): boolean {
    return this.store.selectedContact()?.id === contact.id;
  }

  protected formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  protected getInitials(username: string): string {
    return username.slice(0, 2).toUpperCase();
  }
}
