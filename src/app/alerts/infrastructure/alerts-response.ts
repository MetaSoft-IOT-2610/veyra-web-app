import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource DTO received from the API for a single alert.
 * Maps 1:1 to the backend JSON representation.
 */
export interface AlertResource extends BaseResource {
  id: number;
  nursingHomeId: number;
  residentId: number;
  residentName: string;
  roomNumber: string;
  title: string;
  description: string;
  /** URGENT | WARNING | INFO */
  severity: string;
  /** VITAL_SIGNS | TELEMETRY | MEDICATION | FALL_RISK | GENERAL */
  type: string;
  /** STAFF | SYSTEM | IOT */
  source: string;
  /** UNREAD | READ | ACKNOWLEDGED */
  status: string;
  reportedBy: string;
  createdAt: string;
}

/**
 * Wrapped collection response from the API.
 * The backend may return { "alerts": [...] } or a plain array.
 * BaseApiEndpoint handles both cases automatically.
 */
export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
