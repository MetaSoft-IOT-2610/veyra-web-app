import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { LayoutNursingHome } from '../../../../shared/presentation/components/layout-nursing-home/layout-nursing-home';
import { ActivitiesStore } from '../../../application/activities.store';
import { Activity, ActivityType, ActivityStatus } from '../../../domain/model/activity.entity';
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
    LayoutNursingHome,
    TranslatePipe
  ],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.css'
})
export class ActivityList {
  protected store = inject(ActivitiesStore);

  selectedFilter = signal<string>('Todas');
  selectedActivity = signal<Activity | null>(null);
  showAddModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);

  filters = [
    { key: 'Todas', label: 'activities.filters.all' },
    { key: 'Recreativas', label: 'activities.filters.recreational' },
    { key: 'Médicas', label: 'activities.filters.medical' },
    { key: 'Físicas', label: 'activities.filters.physical' },
    { key: 'Sociales', label: 'activities.filters.social' }
  ];

  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE'];

  // Form fields
  formName = '';
  formNotes = '';
  formType: ActivityType = 'MEAL';
  formDate = '';
  formTime = '';

  get activities(): Activity[] {
    return this.store.activities();
  }

  get filteredActivities(): Activity[] {
    const filter = this.selectedFilter();
    if (filter === 'Todas') return this.activities;
    const map: Record<string, ActivityType> = {
      'Médicas': 'MEAL',
      'Físicas': 'BATH',
      'Recreativas': 'RISK_PROFILE'
    };
    return this.activities.filter(a => a.type === map[filter]);
  }

  get loading(): boolean { return this.store.loading(); }
  get error(): string | null { return this.store.error(); }

  setFilter(filter: string) { this.selectedFilter.set(filter); }

  openDetail(activity: Activity) { this.selectedActivity.set(activity); }
  closeDetail() { this.selectedActivity.set(null); }

  openAddModal() {
    this.formName = '';
    this.formNotes = '';
    this.formType = 'MEAL';
    this.formDate = '';
    this.formTime = '';
    this.showAddModal.set(true);
  }
  closeAddModal() { this.showAddModal.set(false); }

  openEditModal(activity: Activity) {
    this.selectedActivity.set(null);
    this.formName = activity.notes;
    this.formNotes = activity.notes;
    this.formType = activity.type;
    this.formDate = activity.loggedAt.split('T')[0];
    this.formTime = activity.loggedAt.split('T')[1]?.slice(0, 5) || '';
    this.showEditModal.set(true);
  }
  closeEditModal() { this.showEditModal.set(false); }

  saveActivity() {
    const activity = new Activity({
      id: 0,
      residentId: 1,
      healthcareStaffId: Number(localStorage.getItem('staffId')) || 1,
      type: this.formType,
      status: 'PENDING' as ActivityStatus,
      notes: this.formNotes,
      loggedAt: `${this.formDate}T${this.formTime}:00`
    });
    this.store.logActivity(activity);
    this.closeAddModal();
  }

  completeActivity(id: number) { this.store.completeActivity(id); }

  getStatusLabel(status: ActivityStatus): string {
    const map: Record<ActivityStatus, string> = {
      'PENDING': 'Programado',
      'IN_PROGRESS': 'En curso',
      'COMPLETED': 'Completado'
    };
    return map[status];
  }

  getTypeLabel(type: ActivityType): string {
    const map: Record<ActivityType, string> = {
      'MEAL': 'Médica',
      'BATH': 'Física',
      'RISK_PROFILE': 'Recreativa'
    };
    return map[type];
  }
}
