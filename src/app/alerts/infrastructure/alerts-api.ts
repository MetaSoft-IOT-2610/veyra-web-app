import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AlertsApiEndpoint } from './alerts-api-endpoint';
import { Alert, AlertStatus } from '../domain/model/alert.entity';

/**
 * API service for the Alerts bounded context.
 * Delegates all HTTP operations to AlertsApiEndpoint.
 */
@Injectable({ providedIn: 'root' })
export class AlertsApi extends BaseApi {
  private readonly _endpoint: AlertsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._endpoint = new AlertsApiEndpoint(http);
  }

  /** GET /alerts */
  getAll(): Observable<Alert[]> {
    return this._endpoint.getAll();
  }

  /** GET /alerts?nursingHomeId={id} */
  getByNursingHome(nursingHomeId: number): Observable<Alert[]> {
    return this._endpoint.getByNursingHome(nursingHomeId);
  }

  /** GET /alerts/{id} */
  getById(id: number): Observable<Alert> {
    return this._endpoint.getById(id);
  }

  /** GET /alerts?residentId={id} */
  getByResidentId(residentId: number): Observable<Alert[]> {
    return this._endpoint.getByResidentId(residentId);
  }

  /** GET /alerts?nursingHomeId={id}&status={status} */
  getByStatus(nursingHomeId: number, status: AlertStatus): Observable<Alert[]> {
    return this._endpoint.getByStatus(nursingHomeId, status);
  }

  /** POST /alerts */
  create(alert: Alert): Observable<Alert> {
    return this._endpoint.create(alert);
  }

  /** DELETE /alerts/{id} */
  delete(id: number): Observable<void> {
    return this._endpoint.delete(id);
  }

  /** PATCH /alerts/{id}/acknowledge  body: { acknowledgedBy } */
  acknowledge(alertId: number, acknowledgedBy: string): Observable<Alert> {
    return this._endpoint.acknowledge(alertId, acknowledgedBy);
  }

  /** PATCH /alerts/{id}/read */
  markAsRead(alertId: number): Observable<Alert> {
    return this._endpoint.markAsRead(alertId);
  }

  /** PATCH /alerts/mark-all-read?nursingHomeId={id} */
  markAllAsRead(nursingHomeId: number): Observable<void> {
    return this._endpoint.markAllAsRead(nursingHomeId);
  }
}
