import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { activitiesNav } from '../../activities-routes';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { ActivitiesStore } from '../../../application/activities.store';
import { Activity, ActivityType, ActivityStatus, WeekDay } from '../../../domain/model/activity.entity';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCheckbox,
  ],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.css'
})
export class ActivityForm {
  protected store = inject(ActivitiesStore);
  private router = inject(Router);

  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE', 'RECREATIONAL'];
  weekDays: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  title: string = '';
  type: ActivityType = 'MEAL';
  isRecurring: boolean = false;
  recurringDays: WeekDay[] = [];

  get loading(): boolean { return this.store.loading(); }
  get error(): string | null { return this.store.error(); }

  toggleDay(day: WeekDay) {
    if (this.recurringDays.includes(day)) {
      this.recurringDays = this.recurringDays.filter(d => d !== day);
    } else {
      this.recurringDays = [...this.recurringDays, day];
    }
  }

  isDaySelected(day: WeekDay): boolean {
    return this.recurringDays.includes(day);
  }

  onSubmit() {
    if (!this.title.trim()) return;

    const activity = new Activity({
      id: 0,
      residentId: 1,
      healthcareStaffId: Number(localStorage.getItem('staffId')) || 1,
      type: this.type,
      title: this.title,
      status: 'PENDING' as ActivityStatus,
      isRecurring: this.isRecurring,
      recurringDays: this.isRecurring ? [...this.recurringDays] : [],
    });

    this.store.logActivity(activity);

    if (!this.error) {
      void this.router.navigate(activitiesNav.list());
    }
  }

  onCancel() {
    void this.router.navigate(activitiesNav.list());
  }
}
