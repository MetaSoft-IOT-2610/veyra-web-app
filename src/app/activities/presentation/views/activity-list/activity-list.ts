import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ActivitiesStore } from '../../../application/activities.store';
import { Activity, ActivityType, ActivityStatus, WeekDay } from '../../../domain/model/activity.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIcon,
    MatIconButton,
    TranslatePipe
  ],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css'
})
/**
 * Main view for the Activities bounded context.
 *
 * Displays the full list of activities with dual filtering (by type tab and
 * by status panel), and provides inline modals for creating, editing,
 * deleting, and viewing the detail of an activity.
 *
 * State is fully managed via {@link ActivitiesStore}. UI state (open modals,
 * selected filters, form fields) is handled locally with Angular Signals.
 *
 * @see ActivitiesStore for the application-layer store
 * @see ActivityForm for the full-page creation form at /activities/new
 */
export class ActivityList {
  /** Application store providing activities state and CRUD operations. */
  protected store = inject(ActivitiesStore);

  // ─── UI state ────────────────────────────────────────────────────────────────

  /** Currently active type filter key. Defaults to 'ALL'. */
  selectedFilter = signal<string>('ALL');

  /** Currently active status filter key. Defaults to 'ALL'. */
  selectedStatusFilter = signal<string>('ALL');

  /** Whether the status filter dropdown panel is visible. */
  showFilterPanel = signal<boolean>(false);

  /** The activity currently shown in the detail modal, or null if closed. */
  selectedActivity = signal<Activity | null>(null);

  /** Whether the add activity modal is open. */
  showAddModal = signal<boolean>(false);

  /** Whether the edit activity modal is open. */
  showEditModal = signal<boolean>(false);

  /** Whether the delete confirmation modal is open. */
  showDeleteConfirm = signal<boolean>(false);

  /** ID of the activity pending deletion, or null if none. */
  activityToDelete = signal<number | null>(null);

  // ─── Filter config ───────────────────────────────────────────────────────────

  /** Type filter tab definitions. Keys match {@link ActivityType} values. */
  filters = [
    { key: 'ALL',          label: 'activities.filters.all' },
    { key: 'MEAL',         label: 'activities.filters.meal' },
    { key: 'BATH',         label: 'activities.filters.bath' },
    { key: 'RISK_PROFILE', label: 'activities.filters.risk-profile' },
    { key: 'RECREATIONAL', label: 'activities.filters.recreational' },
  ];

  /** Status filter panel options. Keys match {@link ActivityStatus} values. */
  statusFilters = [
    { key: 'ALL',         label: 'activities.status-filters.all' },
    { key: 'PENDING',     label: 'activities.status-filters.pending' },
    { key: 'IN_PROGRESS', label: 'activities.status-filters.in-progress' },
    { key: 'COMPLETED',   label: 'activities.status-filters.completed' },
  ];

  // ─── Form state ──────────────────────────────────────────────────────────────

  /** Available activity categories for the add/edit form selector. */
  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE', 'RECREATIONAL'];

  /** Ordered week days for the recurrence day picker. */
  weekDays: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  /** Form field: activity type. Bound to the category selector. */
  formType: ActivityType = 'MEAL';

  /** Form field: activity title. Bound to the title input. */
  formTitle: string = '';

  /** Form field: recurrence toggle. True when the activity repeats weekly. */
  formIsRecurring: boolean = false;

  /** Form field: selected recurring days. Empty when {@link formIsRecurring} is false. */
  formRecurringDays: WeekDay[] = [];

  /** The activity currently being edited, or null when in create mode. */
  editingActivity: Activity | null = null;

  // ─── Store accessors ─────────────────────────────────────────────────────────

  /** @returns All activities loaded from the store. */
  get activities(): Activity[] { return this.store.activities(); }

  /** @returns True while any async store operation is in progress. */
  get loading(): boolean { return this.store.loading(); }

  /** @returns The last error message from the store, or null if none. */
  get error(): string | null { return this.store.error(); }

  /**
   * Computed signal that applies the active type and status filters to the
   * full activity list. Re-evaluates automatically when either filter or
   * the underlying store data changes.
   *
   * @returns Filtered array of {@link Activity} entities
   */
  filteredActivities = computed(() => {
    const typeFilter = this.selectedFilter();
    const statusFilter = this.selectedStatusFilter();
    let result = this.store.activities();
    if (typeFilter !== 'ALL') result = result.filter(a => a.type === typeFilter);
    if (statusFilter !== 'ALL') result = result.filter(a => a.status === statusFilter);
    return result;
  });

  // ─── Filter actions ──────────────────────────────────────────────────────────

  /**
   * Sets the active type filter.
   * @param filter - One of the type filter keys ('ALL' | ActivityType)
   */
  setFilter(filter: string): void { this.selectedFilter.set(filter); }

  /**
   * Sets the active status filter and closes the filter panel.
   * @param status - One of the status filter keys ('ALL' | ActivityStatus)
   */
  setStatusFilter(status: string): void {
    this.selectedStatusFilter.set(status);
    this.showFilterPanel.set(false);
  }

  /** Toggles the visibility of the status filter dropdown panel. */
  toggleFilterPanel(): void { this.showFilterPanel.update(v => !v); }

  // ─── Detail modal ────────────────────────────────────────────────────────────

  /**
   * Opens the detail modal for the given activity.
   * @param activity - The activity to display
   */
  openDetail(activity: Activity): void { this.selectedActivity.set(activity); }

  /** Closes the detail modal. */
  closeDetail(): void { this.selectedActivity.set(null); }

  // ─── Add modal ───────────────────────────────────────────────────────────────

  /** Resets the form to defaults and opens the add activity modal. */
  openAddModal(): void {
    this.formType = 'MEAL';
    this.formTitle = '';
    this.formIsRecurring = false;
    this.formRecurringDays = [];
    this.editingActivity = null;
    this.showAddModal.set(true);
  }

  /** Closes the add activity modal without saving. */
  closeAddModal(): void { this.showAddModal.set(false); }

  // ─── Edit modal ──────────────────────────────────────────────────────────────

  /**
   * Populates the form with the given activity's data and opens the edit modal.
   * Closes the detail modal first if it was open.
   * @param activity - The activity to edit
   */
  openEditModal(activity: Activity): void {
    this.selectedActivity.set(null);
    this.editingActivity = activity;
    this.formType = activity.type;
    this.formTitle = activity.title ?? '';
    this.formIsRecurring = activity.isRecurring ?? false;
    this.formRecurringDays = Array.isArray(activity.recurringDays)
      ? [...activity.recurringDays].filter((d): d is WeekDay => !!d)
      : [];
    this.showEditModal.set(true);
  }

  /** Closes the edit modal and clears the editing reference. */
  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingActivity = null;
  }

  // ─── Delete confirm modal ────────────────────────────────────────────────────

  /**
   * Stores the activity ID to delete and opens the confirmation modal.
   * @param id - ID of the activity to delete
   */
  openDeleteConfirm(id: number): void {
    this.activityToDelete.set(id);
    this.showDeleteConfirm.set(true);
  }

  /** Closes the delete confirmation modal without deleting. */
  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.activityToDelete.set(null);
  }

  /**
   * Confirms and executes the deletion of the pending activity.
   * Delegates to {@link ActivitiesStore#deleteActivity} and closes the modal.
   */
  confirmDelete(): void {
    const id = this.activityToDelete();
    if (id !== null) this.store.deleteActivity(id);
    this.closeDeleteConfirm();
  }

  // ─── Recurring days helpers ──────────────────────────────────────────────────

  /**
   * Toggles the selection of a week day in the form's recurring days list.
   * @param day - The week day to toggle
   */
  toggleDay(day: WeekDay): void {
    if (!day) return;
    if (this.formRecurringDays.includes(day)) {
      this.formRecurringDays = this.formRecurringDays.filter(d => d !== day);
    } else {
      this.formRecurringDays = [...this.formRecurringDays, day];
    }
  }

  /**
   * Checks whether a week day is currently selected in the form.
   * @param day - The week day to check
   * @returns True if the day is in {@link formRecurringDays}
   */
  isDaySelected(day: WeekDay): boolean {
    return this.formRecurringDays.includes(day);
  }

  // ─── Save (create / update) ──────────────────────────────────────────────────

  /**
   * Saves the current form state as a new or updated activity.
   *
   * - In edit mode: builds a new {@link Activity} instance (required for
   *   signal reactivity) and calls {@link ActivitiesStore#updateActivity}.
   * - In create mode: builds a PENDING activity and calls
   *   {@link ActivitiesStore#logActivity}.
   *
   * Guards against empty titles. Closes the active modal on completion.
   */
  saveActivity(): void {
    if (!this.formTitle.trim()) return;

    if (this.showEditModal() && this.editingActivity) {
      const updated = new Activity({
        id: this.editingActivity.id,
        nursingHomeId: this.editingActivity.nursingHomeId,
        residentId: this.editingActivity.residentId,
        healthcareStaffId: this.editingActivity.healthcareStaffId,
        type: this.formType,
        title: this.formTitle,
        status: this.editingActivity.status,
        isRecurring: this.formIsRecurring,
        recurringDays: this.formIsRecurring ? [...this.formRecurringDays] : [],
      });
      this.store.updateActivity(updated);
      this.closeEditModal();
      return;
    }

    const activity = new Activity({
      id: 0,
      nursingHomeId: Number(localStorage.getItem('nursingHomeId')) || 1,
      residentId: 1,
      healthcareStaffId: Number(localStorage.getItem('staffId')) || 1,
      type: this.formType,
      title: this.formTitle,
      status: 'PENDING' as ActivityStatus,
      isRecurring: this.formIsRecurring,
      recurringDays: this.formIsRecurring ? this.formRecurringDays : [],
    });
    this.store.logActivity(activity);
    this.closeAddModal();
  }
}
