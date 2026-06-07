import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken, Messaging, MessagePayload } from 'firebase/messaging';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Infrastructure service for Firebase Cloud Messaging (FCM) Web.
 *
 * Responsibilities:
 *  - Initialize Firebase app (idempotent — reuses existing app instance).
 *  - Register the FCM service worker at /firebase-messaging-sw.js.
 *  - Request Notification permission from the browser.
 *  - Obtain and refresh the FCM token (result is cached in localStorage as 'fcmToken').
 *  - Subscribe to foreground messages and emit them through `foregroundMessage$`.
 *  - Revoke the current FCM token on sign-out.
 *
 * This service is pure infrastructure: it has no knowledge of user identity or
 * backend API calls. Token registration with the backend is orchestrated by IamStore.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseMessagingService {
  private readonly app: FirebaseApp;
  private messaging: Messaging | null = null;
  private readonly _foregroundMessage$ = new Subject<MessagePayload>();

  /** Stream of FCM messages received while the app is in the foreground. */
  readonly foregroundMessage$: Observable<MessagePayload> = this._foregroundMessage$.asObservable();

  /**
   * Single in-flight initialization promise to prevent duplicate calls when
   * initAndGetToken() is triggered by both signIn() and MainLayout.ngOnInit().
   */
  private _initPromise: Promise<string | null> | null = null;

  constructor() {
    this.app = getApps().length ? getApp() : initializeApp(environment.firebaseConfig);
  }

  /**
   * Full FCM initialization flow:
   *  1. Checks browser support (Notification + ServiceWorker + PushManager).
   *  2. Requests Notification permission.
   *  3. Registers the FCM service worker.
   *  4. Retrieves the FCM registration token using the VAPID key.
   *  5. Stores the token in localStorage under 'fcmToken'.
   *  6. Subscribes to foreground messages.
   *
   * Returns the FCM token, or null if unsupported / permission denied / error.
   * Subsequent calls return the cached promise (idempotent).
   */
  initAndGetToken(): Promise<string | null> {
    if (this._initPromise) {
      return this._initPromise;
    }
    this._initPromise = this._doInit();
    return this._initPromise;
  }

  /**
   * Deletes the current FCM token from Firebase and removes it from localStorage.
   * Should be called on sign-out to prevent stale tokens from receiving notifications.
   */
  async deleteCurrentToken(): Promise<void> {
    if (this.messaging) {
      try {
        await deleteToken(this.messaging);
      } catch (err) {
        console.error('[FCM] deleteToken failed:', err);
      }
    }
    localStorage.removeItem('fcmToken');
    this._initPromise = null;
  }

  /** Returns the FCM token stored in localStorage, or null if not set. */
  storedToken(): string | null {
    return localStorage.getItem('fcmToken');
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private async _doInit(): Promise<string | null> {
    if (!this._isSupported()) {
      console.warn('[FCM] Not supported in this browser environment.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission denied.');
      this._initPromise = null;
      return null;
    }

    try {
      const swRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/', updateViaCache: 'none' }
      );

      this.messaging = getMessaging(this.app);

      const token = await getToken(this.messaging, {
        vapidKey: environment.firebaseVapidKey,
        serviceWorkerRegistration: swRegistration,
      });

      if (!token) {
        console.warn('[FCM] getToken returned empty — check VAPID key and Firebase project config.');
        this._initPromise = null;
        return null;
      }

      localStorage.setItem('fcmToken', token);

      onMessage(this.messaging, payload => {
        this._foregroundMessage$.next(payload);
      });

      return token;
    } catch (err) {
      console.error('[FCM] Initialization failed:', err);
      this._initPromise = null;
      return null;
    }
  }

  private _isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }
}
