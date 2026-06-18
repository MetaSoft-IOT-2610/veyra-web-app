import { computed, Injectable, signal } from '@angular/core';
import { ActivitiesApi } from '../infrastructure/activities-api';
import { Activity, ActivityStatus, ActivityType, WeekDay } from '../domain/model/activity.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

/**
 * Application-layer store for the Activities bounded context.
 *
 * Manages the in-memory state of activities using Angular signals.
 * Acts as the single source of truth for all activity-related state
 * consumed by the presentation layer.
 *
 * Responsibilities:
 * - Load and cache activities from the backend
 * - Expose reactive state via readonly signals
 * - Coordinate domain operations with API calls
 *
 * Used by: administrators (web) for full CRUD management.
 * Note: complete() is reserved for healthcare staff (mobile).
 */
@Injectable({ providedIn: 'root' })
export class ActivitiesStore {

  // ─── Private state ───────────────────────────────────────────────────────────

  private readonly _activitiesSignal = signal<Activity[]>([]);
  private readonly _selectedActivitySignal = signal<Activity | null>(null);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  // ─── Public readonly signals ─────────────────────────────────────────────────

  /** All loaded activities */
  readonly activities = this._activitiesSignal.asReadonly();

  /** Currently selected activity (for edit/detail views) */
  readonly selectedActivity = this._selectedActivitySignal.asReadonly();

  /** True while any async operation is in progress */
  readonly loading = this._loadingSignal.asReadonly();

  /** Error message from the last failed operation, or null */
  readonly error = this._errorSignal.asReadonly();

  // ─── Computed signals ────────────────────────────────────────────────────────

  /** Total number of loaded activities */
  readonly activitiesCount = computed(() => this.activities().length);

  /** Activities that are still pending execution */
  readonly pendingActivities = computed(() =>
    this.activities().filter(a => a.status === 'PENDING')
  );

  /** Activities currently being executed by staff */
  readonly inProgressActivities = computed(() =>
    this.activities().filter(a => a.status === 'IN_PROGRESS')
  );

  /** Activities that have been completed by staff */
  readonly completedActivities = computed(() =>
    this.activities().filter(a => a.isCompleted())
  );

  /** Activities configured to recur on a weekly schedule */
  readonly recurringActivities = computed(() =>
    this.activities().filter(a => a.isRecurring)
  );

  /**
   * @param activitiesApi - Injected API service for HTTP operations
   */
  constructor(private activitiesApi: ActivitiesApi) {
    this.loadActivities();
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Loads all activities from the backend on store initialization.
   */
  private loadActivities(): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.activitiesApi.getAll().pipe(takeUntilDestroyed()).subscribe({
      next: activities => {
        this._activitiesSignal.set(activities);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to load activities'));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Formats an error into a readable string message.
   * @param error - The thrown error object
   * @param fallback - Default message if error cannot be parsed
   * @returns Formatted error string
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    return fallback;
  }

  // ─── Public methods ───────────────────────────────────────────────────────────

  /**
   * Returns a computed signal resolving to a single activity by ID.
   * @param id - Activity ID to look up
   * @returns Computed signal emitting the matching Activity or undefined
   */
  getActivityById(id: number | null | undefined) {
    return computed(() => id ? this.activities().find(a => a.id === id) : undefined);
  }

  /**
   * Filters activities by type.
   * @param type - ActivityType to filter by
   * @returns Computed signal emitting filtered activities
   */
  getActivitiesByType(type: ActivityType) {
    return computed(() => this.activities().filter(a => a.type === type));
  }

  /**
   * Sets the currently selected activity for edit or detail views.
   * @param activity - Activity to select, or null to clear selection
   */
  selectActivity(activity: Activity | null): void {
    this._selectedActivitySignal.set(activity);
  }

  /**
   * Creates a new activity. Transitions status to IN_PROGRESS via log().
   * Used by administrators from the web platform.
   * @param activity - Activity entity to create
   */
  logActivity(activity: Activity): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    const logged = activity.log();
    this.activitiesApi.create(logged).pipe(retry(2)).subscribe({
      next: created => {
        this._activitiesSignal.update(list => [...list, created]);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to log activity'));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing activity's editable fields.
   * Used by administrators from the web platform.
   * @param activity - Activity entity with updated fields
   */
  updateActivity(activity: Activity): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    // Clean undefined values before sending
    activity.recurringDays = activity.recurringDays.filter((d): d is WeekDay => !!d);
    this.activitiesApi.update(activity).pipe(retry(2)).subscribe({
      next: updated => {
        this._activitiesSignal.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, `Failed to update activity ${activity.id}`));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an activity by ID and removes it from the local state.
   * Used by administrators from the web platform.
   * @param id - ID of the activity to delete
   */
  deleteActivity(id: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.activitiesApi.delete(id).pipe(retry(2)).subscribe({
      next: () => {
        this._activitiesSignal.update(list => list.filter(a => a.id !== id));
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, `Failed to delete activity ${id}`));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Marks an activity as COMPLETED.
   * Reserved for healthcare staff via the mobile application.
   * @param id - ID of the activity to complete
   */
  completeActivity(id: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.activitiesApi.complete(id).pipe(retry(2)).subscribe({
      next: updated => {
        this._activitiesSignal.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, `Failed to complete activity ${id}`));
        this._loadingSignal.set(false);
      }
    });
  }

  /**
   * Resets the store to its initial empty state.
   * Typically called on logout or context switch.
   */
  resetActivities(): void {
    this._activitiesSignal.set([]);
    this._selectedActivitySignal.set(null);
    this._errorSignal.set(null);
  }
}
