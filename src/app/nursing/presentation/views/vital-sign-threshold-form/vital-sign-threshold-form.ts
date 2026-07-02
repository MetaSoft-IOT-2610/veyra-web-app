import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { VitalSignThreshold } from '../../../../health/domain/model/vital-sign-threshold.entity';
import { VitalSignThresholdService } from '../../../../health/infrastructure/vital-sign-threshold.service';
import { nursingNav } from '../../nursing-routes';

@Component({
  selector: 'app-vital-sign-threshold-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    TranslatePipe
  ],
  templateUrl: './vital-sign-threshold-form.html',
  styleUrl: './vital-sign-threshold-form.css'
})
export class VitalSignThresholdForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly thresholdService = inject(VitalSignThresholdService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  residentId: number | null = null;

  form = this.fb.group({
    minHeartRate: new FormControl<number>(60, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(300)]
    }),
    maxHeartRate: new FormControl<number>(100, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(300)]
    }),
    minTemperature: new FormControl<number>(35.0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(30), Validators.max(45)]
    }),
    maxTemperature: new FormControl<number>(37.5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(30), Validators.max(45)]
    }),
    minOxygenSaturation: new FormControl<number>(95, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)]
    }),
    minRespiratoryRate: new FormControl<number>(12, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(60)]
    }),
    maxRespiratoryRate: new FormControl<number>(20, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(60)]
    })
  });

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId = id;

      if (!id) {
        void this.router.navigate(nursingNav.residents());
        return;
      }

      this.loadThreshold(id);
    });
  }

  submit(): void {
    if (this.form.invalid || !this.hasValidRanges()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.residentId) {
      void this.router.navigate(nursingNav.residents());
      return;
    }

    const value = this.form.getRawValue();
    const threshold = new VitalSignThreshold({
      residentId: this.residentId,
      minHeartRate: value.minHeartRate,
      maxHeartRate: value.maxHeartRate,
      minTemperature: value.minTemperature,
      maxTemperature: value.maxTemperature,
      minOxygenSaturation: value.minOxygenSaturation,
      minRespiratoryRate: value.minRespiratoryRate,
      maxRespiratoryRate: value.maxRespiratoryRate
    });

    this.saving.set(true);
    this.error.set(null);
    this.thresholdService.saveThreshold(this.residentId, threshold).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(nursingNav.residentDetail(this.residentId!));
      },
      error: () => {
        this.saving.set(false);
        this.error.set('vital-sign-thresholds.error.save');
      }
    });
  }

  onCancel(): void {
    if (this.residentId) {
      void this.router.navigate(nursingNav.residentDetail(this.residentId));
      return;
    }
    void this.router.navigate(nursingNav.residents());
  }

  protected hasValidRanges(): boolean {
    const value = this.form.getRawValue();
    return value.minHeartRate <= value.maxHeartRate
      && value.minTemperature <= value.maxTemperature
      && value.minRespiratoryRate <= value.maxRespiratoryRate;
  }

  private loadThreshold(residentId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.thresholdService.getThresholdByResident(residentId).subscribe({
      next: threshold => {
        this.form.patchValue({
          minHeartRate: threshold.minHeartRate,
          maxHeartRate: threshold.maxHeartRate,
          minTemperature: threshold.minTemperature,
          maxTemperature: threshold.maxTemperature,
          minOxygenSaturation: threshold.minOxygenSaturation,
          minRespiratoryRate: threshold.minRespiratoryRate,
          maxRespiratoryRate: threshold.maxRespiratoryRate
        });
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        if (err?.status && err.status !== 404) {
          this.error.set('vital-sign-thresholds.error.load');
        }
      }
    });
  }
}
