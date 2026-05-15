import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivitiesStore } from '../../../application/activities.store';
import { Activity, ActivityType, ActivityStatus } from '../../../domain/model/activity.entity';

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
    MatIcon
  ],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.css'
})
export class ActivityForm {
  protected store = inject(ActivitiesStore);
  private router = inject(Router);

  activityTypes: ActivityType[] = ['MEAL', 'BATH', 'RISK_PROFILE'];

  residentId: number = 0;
  healthcareStaffId: number = Number(localStorage.getItem('staffId'));
  type: ActivityType = 'MEAL';
  notes: string = '';

  get loading(): boolean {
    return this.store.loading();
  }

  get error(): string | null {
    return this.store.error();
  }

  onSubmit() {
    const activity = new Activity({
      id: 0,
      residentId: this.residentId,
      healthcareStaffId: this.healthcareStaffId,
      type: this.type,
      status: 'PENDING' as ActivityStatus,
      notes: this.notes,
      loggedAt: new Date().toISOString()
    });

    this.store.logActivity(activity);

    if (!this.error) {
      this.router.navigate(['/activities']);
    }
  }

  onCancel() {
    this.router.navigate(['/activities']);
  }
}
