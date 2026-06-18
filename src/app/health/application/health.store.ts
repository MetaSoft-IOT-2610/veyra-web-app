import { Injectable, signal } from '@angular/core';

import { Allergy } from '../domain/model/allergy.entity';
import { VitalSignThreshold } from '../domain/model/vital-sign-threshold.entity';
import { AllergiesApiService } from '../infrastructure/allergies-api.service';
import { VitalSignThresholdService } from '../infrastructure/vital-sign-threshold.service';
import { TrackingAcl, VitalSignReading, ThresholdCheckResult } from '../infrastructure/acl/tracking.acl';

@Injectable({
  providedIn: 'root'
})
export class HealthStore {
  private readonly _allergiesSignal = signal<Allergy[]>([]);
  private readonly _thresholdSignal = signal<VitalSignThreshold | null>(null);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly allergies = this._allergiesSignal.asReadonly();
  readonly threshold = this._thresholdSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  private readonly trackingAcl = new TrackingAcl();

  constructor(
    private allergiesApiService: AllergiesApiService,
    private vitalSignThresholdService: VitalSignThresholdService
  ) {}

  loadAllergiesByResident(residentId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.allergiesApiService.getAllergiesByResidentId(residentId).subscribe({
      next: (allergies) => {
        this._allergiesSignal.set(allergies);
        this._loadingSignal.set(false);
      },
      error: () => {
        this._errorSignal.set('Could not load allergies.');
        this._loadingSignal.set(false);
      }
    });
  }

  loadThresholdByResident(residentId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.vitalSignThresholdService.getThresholdByResident(residentId).subscribe({
      next: (threshold) => {
        this._thresholdSignal.set(threshold);
        this._loadingSignal.set(false);
      },
      error: () => {
        this._errorSignal.set('Could not load vital sign thresholds.');
        this._loadingSignal.set(false);
      }
    });
  }

  checkReadingAgainstThreshold(rawReading: {
    residentId: number;
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    oxygenSaturation: number;
    respiratoryRate: number;
    registeredAt: string;
  }): ThresholdCheckResult | null {
    const threshold = this._thresholdSignal();
    if (!threshold) return null;

    const reading: VitalSignReading = this.trackingAcl.fromTrackingVitalSign(rawReading);
    return this.trackingAcl.checkAgainstThreshold(reading, threshold);
  }
}
