/**
 * Request payload for FCM token registration.
 * Maps to backend's RegisterUserPushTokenResource.
 *
 * The `platform` field is required by the backend (PushPlatform enum: ANDROID | IOS | WEB).
 * Web clients always send 'WEB'.
 */
export interface RegisterFcmTokenRequest {
  token: string;
  platform: 'WEB';
}

/**
 * Request payload for FCM token removal.
 * Maps to backend's UnregisterUserPushTokenResource.
 */
export interface UnregisterFcmTokenRequest {
  token: string;
}
