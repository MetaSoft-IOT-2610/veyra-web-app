import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AlertResource, AlertsResponse } from './alerts-response';
import { Alert, AlertStatus } from '../domain/model/alert.entity';
import { AlertAssembler } from './alert-assembler';

const BASE_URL = 'https://my-json-server.typicode.com/MetaSoft-IOT-2610/fake-api-alerts/alerts';

/**
 * API endpoint for Alerts bounded context.
 *
 * Inherited from BaseApiEndpoint (standard CRUD):
 *   GET    /alerts                              → AlertResource[] or AlertsResponse
 *   GET    /alerts/{id}                         → AlertResource
 *   POST   /alerts                              → AlertResource
 *   PUT    /alerts/{id}                         → AlertResource
 *   DELETE /alerts/{id}                         → void
 *
 * Custom operations added here:
 *   GET    /alerts?nursingHomeId={id}           → AlertResource[]
 *   GET    /alerts?residentId={id}              → AlertResource[]
 *   GET    /alerts?nursingHomeId={id}&status={s}→ AlertResource[]
 *   PATCH  /alerts/{id}/acknowledge             → AlertResource  body: { acknowledgedBy }
 *   PATCH  /alerts/{id}/read                    → AlertResource
 *   PATCH  /alerts/mark-all-read?nursingHomeId={id} → void
 */
export class AlertsApiEndpoint extends BaseApiEndpoint<Alert, AlertResource, AlertsResponse, AlertAssembler> {

  constructor(http: HttpClient) {
    super(http, BASE_URL, new AlertAssembler());
  }

  /**
   * Retrieves all alerts for a given nursing home.
   * GET /alerts?nursingHomeId={nursingHomeId}
   */
  getByNursingHome(nursingHomeId: number): Observable<Alert[]> {
    return this.http.get<AlertResource[]>(`${this.endpointUrl}?nursingHomeId=${nursingHomeId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch alerts for nursing home'))
    );
  }

  /**
   * Retrieves all alerts associated to a specific resident.
   * GET /alerts?residentId={residentId}
   */
  getByResidentId(residentId: number): Observable<Alert[]> {
    return this.http.get<AlertResource[]>(`${this.endpointUrl}?residentId=${residentId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch alerts for resident ${residentId}`))
    );
  }

  /**
   * Retrieves alerts filtered by status for a nursing home.
   * GET /alerts?nursingHomeId={nursingHomeId}&status={status}
   */
  getByStatus(nursingHomeId: number, status: AlertStatus): Observable<Alert[]> {
    return this.http.get<AlertResource[]>(
      `${this.endpointUrl}?nursingHomeId=${nursingHomeId}&status=${status}`
    ).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch alerts with status ${status}`))
    );
  }

  /**
   * Acknowledges a specific alert.
   * PATCH /alerts/{alertId}/acknowledge  body: { acknowledgedBy }
   */
  acknowledge(alertId: number, acknowledgedBy: string): Observable<Alert> {
    return this.http.patch<AlertResource>(
      `${this.endpointUrl}/${alertId}/acknowledge`,
      { acknowledgedBy }
    ).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to acknowledge alert ${alertId}`))
    );
  }

  /**
   * Marks a specific alert as read.
   * PATCH /alerts/{alertId}/read
   */
  markAsRead(alertId: number): Observable<Alert> {
    return this.http.patch<AlertResource>(
      `${this.endpointUrl}/${alertId}/read`,
      {}
    ).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to mark alert ${alertId} as read`))
    );
  }

  /**
   * Marks all alerts as read for a given nursing home.
   * PATCH /alerts/mark-all-read?nursingHomeId={nursingHomeId}
   */
  markAllAsRead(nursingHomeId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.endpointUrl}/mark-all-read?nursingHomeId=${nursingHomeId}`,
      {}
    ).pipe(
      catchError(this.handleError('Failed to mark all alerts as read'))
    );
  }
}
