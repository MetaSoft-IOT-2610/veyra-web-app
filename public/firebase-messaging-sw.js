/* =============================================================================
 * firebase-messaging-sw.js — FCM Background Message Handler
 * -----------------------------------------------------------------------------
 * This file is served at the root path (/firebase-messaging-sw.js) as a static
 * asset from the public/ directory.
 *
 * For CI/CD (Cloudflare Pages, GitHub Actions, etc.) run the build script first:
 *   node scripts/generate-fcm-sw.js && ng build
 * The script reads FIREBASE_* environment variables and overwrites this file with
 * the real configuration before the Angular build copies it to dist/.
 *
 * IMPORTANT: Replace the placeholder values below with your real Firebase project
 * config before deploying, OR use the generate-fcm-sw.js script.
 * ============================================================================= */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAh2nXjZIW5dWci5GH-ibsR7ysRxGas_Dg',
  authDomain: 'upc-pre-iot-metasoft.firebaseapp.com',
  projectId: 'upc-pre-iot-metasoft',
  storageBucket: 'upc-pre-iot-metasoft.firebasestorage.app',
  messagingSenderId: '565630535895',
  appId: '1:565630535895:web:3cfbc0720c5e0dc2438892',
});

const messaging = firebase.messaging();

/**
 * Handles FCM messages received while the app is in the background or closed.
 * Firebase automatically shows a system notification for data-only payloads.
 */
messaging.onBackgroundMessage(function (payload) {
  const title = payload.notification?.title ?? 'Veyra';
  const body = payload.notification?.body ?? '';
  const icon = payload.notification?.icon ?? '/images/shared/logo.png';

  return self.registration.showNotification(title, {
    body,
    icon,
    badge: '/images/shared/logo.png',
    data: payload.data ?? {},
    tag: payload.data?.tag ?? 'veyra-notification',
  });
});
