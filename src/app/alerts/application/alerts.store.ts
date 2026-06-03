import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertsApi } from '../infrastructure/alerts-api';
import { Alert, AlertSeverity, AlertStatus } from '../domain/model/alert.entity';

@Injectable({ providedIn: 'root' })
export class AlertsStore {
  private readonly _alertsSignal = signal<Alert[]>([]);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly alerts = this._alertsSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  readonly criticalCount = computed(() =>
    this._alertsSignal().filter(a => a.severity === 'URGENT' && a.status !== 'ACKNOWLEDGED').length
  );

  readonly warningCount = computed(() =>
    this._alertsSignal().filter(a => a.severity === 'WARNING' && a.status !== 'ACKNOWLEDGED').length
  );

  readonly infoCount = computed(() =>
    this._alertsSignal().filter(a => a.severity === 'INFO' && a.status !== 'ACKNOWLEDGED').length
  );

  readonly unreadCount = computed(() =>
    this._alertsSignal().filter(a => a.status === 'UNREAD').length
  );

  readonly totalActive = computed(() =>
    this._alertsSignal().filter(a => a.status !== 'ACKNOWLEDGED').length
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(private alertsApi: AlertsApi) {}

  // ─── Queries ──────────────────────────────────────────────────────────────

  /**
   * Loads every alert regardless of nursing home. Used as fallback when
   * nursingHomeId is not available in session (e.g. fake/mock API).
   * GET /alerts
   */
  loadAllAlerts(): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: alerts => {
          this._alertsSignal.set(alerts);
          this._loadingSignal.set(false);
        },
        error: err => {
          this._errorSignal.set(this.formatError(err, 'Failed to load alerts'));
          this._loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads all alerts for the given nursing home.
   * GET /alerts?nursingHomeId={id}
   */
  loadAlerts(nursingHomeId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.getByNursingHome(nursingHomeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: alerts => {
          this._alertsSignal.set(alerts);
          this._loadingSignal.set(false);
        },
        error: err => {
          this._errorSignal.set(this.formatError(err, 'Failed to load alerts'));
          this._loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads alerts filtered by resident. Appends to the current list (does not replace).
   * Useful from resident-detail view.
   * GET /alerts?residentId={id}
   */
  loadAlertsByResident(residentId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.getByResidentId(residentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: alerts => {
          this._alertsSignal.set(alerts);
          this._loadingSignal.set(false);
        },
        error: err => {
          this._errorSignal.set(this.formatError(err, `Failed to load alerts for resident ${residentId}`));
          this._loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads only alerts with a specific status for the nursing home.
   * Replaces the current list with the filtered result.
   * GET /alerts?nursingHomeId={id}&status={status}
   */
  loadAlertsByStatus(nursingHomeId: number, status: AlertStatus): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.getByStatus(nursingHomeId, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: alerts => {
          this._alertsSignal.set(alerts);
          this._loadingSignal.set(false);
        },
        error: err => {
          this._errorSignal.set(this.formatError(err, `Failed to load alerts with status ${status}`));
          this._loadingSignal.set(false);
        }
      });
  }

  // ─── Commands ─────────────────────────────────────────────────────────────

  /**
   * Creates a manual alert (reported by staff).
   * POST /alerts
   */
  createAlert(alert: Alert): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.create(alert).pipe(retry(2)).subscribe({
      next: created => {
        this._alertsSignal.update(list => [created, ...list]);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to create alert'));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an alert by ID and removes it from the local list.
   * DELETE /alerts/{id}
   */
  deleteAlert(id: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.alertsApi.delete(id).pipe(retry(2)).subscribe({
      next: () => {
        this._alertsSignal.update(list => list.filter(a => a.id !== id));
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, `Failed to delete alert ${id}`));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Acknowledges a single alert.
   * Optimistic: local state updates immediately so the UI responds even when
   * the API is read-only (e.g. my-json-server fake API).
   * PATCH /alerts/{id}/acknowledge
   */
  acknowledgeAlert(alertId: number, acknowledgedBy: string): void {
    this._alertsSignal.update(list =>
      list.map(a => { if (a.id === alertId) a.acknowledge(); return a; })
    );
    this.alertsApi.acknowledge(alertId, acknowledgedBy).pipe(retry(2)).subscribe({
      next: updated => this._alertsSignal.update(list =>
        list.map(a => a.id === updated.id ? updated : a)
      ),
      error: () => {}
    });
  }

  /**
   * Marks a single alert as read.
   * Optimistic: local state updates immediately.
   * PATCH /alerts/{id}/read
   */
  markAsRead(alertId: number): void {
    this._alertsSignal.update(list =>
      list.map(a => { if (a.id === alertId) a.markAsRead(); return a; })
    );
    this.alertsApi.markAsRead(alertId).pipe(retry(2)).subscribe({
      next: updated => this._alertsSignal.update(list =>
        list.map(a => a.id === updated.id ? updated : a)
      ),
      error: () => {}
    });
  }

  /**
   * Marks all unread alerts as read for the current nursing home.
   * Optimistic: local state updates immediately.
   * PATCH /alerts/mark-all-read?nursingHomeId={id}
   */
  markAllAsRead(nursingHomeId: number): void {
    this._alertsSignal.update(list =>
      list.map(a => { if (a.status === 'UNREAD') a.markAsRead(); return a; })
    );
    this.alertsApi.markAllAsRead(nursingHomeId).pipe(retry(2)).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  // ─── Computed helpers ─────────────────────────────────────────────────────

  /** Returns a computed signal with alerts filtered by severity. */
  getAlertsBySeverity(severity: AlertSeverity) {
    return computed(() => this._alertsSignal().filter(a => a.severity === severity));
  }

  /** Returns a computed signal with alerts filtered by status. */
  getAlertsByStatus(status: AlertStatus) {
    return computed(() => this._alertsSignal().filter(a => a.status === status));
  }

  /** Returns a computed signal with alerts for a specific resident. */
  getAlertsByResidentId(residentId: number) {
    return computed(() => this._alertsSignal().filter(a => a.residentId === residentId));
  }

  resetAlerts(): void {
    this._alertsSignal.set([]);
    this._errorSignal.set(null);
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found') ? `${fallback}: Not Found` : error.message;
    return fallback;
  }
}
