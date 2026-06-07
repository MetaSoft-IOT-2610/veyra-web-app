import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const chatView = () =>
  import('./views/chat-view/chat-view').then(m => m.ChatView);

export const chatPaths = {
  inbox: 'inbox',
} as const;

export const chatNav = {
  inbox: () => ['/chat', chatPaths.inbox],
} as const;

const chatRoutes: Routes = [
  definePageRoute({
    path: chatPaths.inbox,
    name: 'chat.inbox',
    loadComponent: chatView,
    page: {
      title: 'Chat',
      module: 'Comunicación',
      description: 'Mensajes con familiares',
      showBackButton: false,
    },
  }),
];

export { chatRoutes };
