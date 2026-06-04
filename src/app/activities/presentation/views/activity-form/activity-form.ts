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

/**
 * Standalone form view for creating a new activity.
 *
 * Accessible at `/activities/new`. Collects the activity title, type,
 * recurrence settings, and submits via {@link ActivitiesStore#logActivity}.
 * On success, navigates back to the activity list.
 *
 * @see ActivityList for inline add/edit modals
 * @see ActivitiesStore for state management
 */
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
  /** Application store providing logActivity and reactive loading/error state. */
  protected store = inject(ActivitiesStore);

  /** Angular router for post-submit navigation. */
  private router = inject(Router);

  /** Available activity categories for the type selector. */
  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE', 'RECREATIONAL'];

  /** Ordered list of week days for the recurrence day picker. */
  weekDays: WeekDay[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  /** Bound to the title input field. */
  title: string = '';

  /** Bound to the activity type selector. Defaults to MEAL. */
  type: ActivityType = 'MEAL';

  /** Bound to the recurrence toggle checkbox. */
  isRecurring: boolean = false;

  /** Days selected for weekly recurrence. Empty when {@link isRecurring} is false. */
  recurringDays: WeekDay[] = [];

  /** @returns True while an async store operation is in progress. */
  get loading(): boolean { return this.store.loading(); }

  /** @returns The last error message from the store, or null if none. */
  get error(): string | null { return this.store.error(); }

  /**
   * Toggles the selection state of a specific week day.
   * Adds the day if not selected; removes it if already selected.
   * @param day - The week day to toggle
   */
  toggleDay(day: WeekDay): void {
    if (this.recurringDays.includes(day)) {
      this.recurringDays = this.recurringDays.filter(d => d !== day);
    } else {
      this.recurringDays = [...this.recurringDays, day];
    }
  }

  /**
   * Checks whether a specific week day is currently selected.
   * @param day - The week day to check
   * @returns True if the day is in the selected recurring days
   */
  isDaySelected(day: WeekDay): boolean {
    return this.recurringDays.includes(day);
  }

  /**
   * Handles form submission.
   * Guards against empty titles. Builds an {@link Activity} entity with
   * PENDING status and delegates creation to the store. Navigates to
   * the activity list on success.
   */
  onSubmit(): void {
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

  /**
   * Cancels the form and navigates back to the activity list without saving.
   */
  onCancel(): void {
    void this.router.navigate(activitiesNav.list());
  }
}
