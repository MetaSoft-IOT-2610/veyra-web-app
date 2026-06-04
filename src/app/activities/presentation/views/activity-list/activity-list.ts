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
export class ActivityList {
  protected store = inject(ActivitiesStore);

  // ─── UI state ────────────────────────────────────────────────────────────────
  selectedFilter = signal<string>('ALL');
  selectedStatusFilter = signal<string>('ALL');
  showFilterPanel = signal<boolean>(false);
  selectedActivity = signal<Activity | null>(null);
  showAddModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  activityToDelete = signal<number | null>(null);

  // ─── Filter config ───────────────────────────────────────────────────────────
  filters = [
    { key: 'ALL',         label: 'activities.filters.all' },
    { key: 'MEAL',        label: 'activities.filters.meal' },
    { key: 'BATH',        label: 'activities.filters.bath' },
    { key: 'RISK_PROFILE',label: 'activities.filters.risk-profile' },
    { key: 'RECREATIONAL',label: 'activities.filters.recreational' }
  ];

  statusFilters = [
    { key: 'ALL',         label: 'activities.status-filters.all' },
    { key: 'PENDING',     label: 'activities.status-filters.pending' },
    { key: 'IN_PROGRESS', label: 'activities.status-filters.in-progress' },
    { key: 'COMPLETED',   label: 'activities.status-filters.completed' },
  ];

  // ─── Form state ──────────────────────────────────────────────────────────────
  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE', 'RECREATIONAL'];
  weekDays: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  formType: ActivityType = 'MEAL';
  formTitle: string = '';
  formIsRecurring: boolean = false;
  formRecurringDays: WeekDay[] = [];
  editingActivity: Activity | null = null;

  // ─── Store accessors ─────────────────────────────────────────────────────────
  get activities(): Activity[] { return this.store.activities(); }
  get loading(): boolean { return this.store.loading(); }
  get error(): string | null { return this.store.error(); }

  filteredActivities = computed(() => {
    const typeFilter = this.selectedFilter();
    const statusFilter = this.selectedStatusFilter();
    let result = this.store.activities();
    if (typeFilter !== 'ALL') result = result.filter(a => a.type === typeFilter);
    if (statusFilter !== 'ALL') result = result.filter(a => a.status === statusFilter);
    return result;
  });

  // ─── Filter actions ──────────────────────────────────────────────────────────
  setFilter(filter: string) { this.selectedFilter.set(filter); }
  setStatusFilter(status: string) {
    this.selectedStatusFilter.set(status);
    this.showFilterPanel.set(false);
  }
  toggleFilterPanel() { this.showFilterPanel.update(v => !v); }

  // ─── Detail modal ────────────────────────────────────────────────────────────
  openDetail(activity: Activity) { this.selectedActivity.set(activity); }
  closeDetail() { this.selectedActivity.set(null); }

  // ─── Add modal ───────────────────────────────────────────────────────────────
  openAddModal() {
    this.formType = 'MEAL';
    this.formTitle = '';
    this.formIsRecurring = false;
    this.formRecurringDays = [];
    this.editingActivity = null;
    this.showAddModal.set(true);
  }
  closeAddModal() { this.showAddModal.set(false); }

  // ─── Edit modal ──────────────────────────────────────────────────────────────
  openEditModal(activity: Activity) {
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
  closeEditModal() {
    this.showEditModal.set(false);
    this.editingActivity = null;
  }

  // ─── Delete confirm modal ────────────────────────────────────────────────────
  openDeleteConfirm(id: number) {
    this.activityToDelete.set(id);
    this.showDeleteConfirm.set(true);
  }
  closeDeleteConfirm() {
    this.showDeleteConfirm.set(false);
    this.activityToDelete.set(null);
  }
  confirmDelete() {
    const id = this.activityToDelete();
    if (id !== null) this.store.deleteActivity(id);
    this.closeDeleteConfirm();
  }

  // ─── Recurring days helpers ──────────────────────────────────────────────────
  toggleDay(day: WeekDay) {
    if (!day) return;
    if (this.formRecurringDays.includes(day)) {
      this.formRecurringDays = this.formRecurringDays.filter(d => d !== day);
    } else {
      this.formRecurringDays = [...this.formRecurringDays, day];
    }
  }
  isDaySelected(day: WeekDay): boolean {
    return this.formRecurringDays.includes(day);
  }

  // ─── Save (create / update) ──────────────────────────────────────────────────
  saveActivity() {
    if (!this.formTitle.trim()) return;

    if (this.showEditModal() && this.editingActivity) {
      const updated = new Activity({
        id: this.editingActivity.id,
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
