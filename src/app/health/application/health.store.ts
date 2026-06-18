import { Injectable, signal } from '@angular/core';

import { Allergy } from '../domain/model/allergy.entity';
import { VitalSign } from '../domain/model/vital-sign.entity';
import { AllergiesApiService } from '../infrastructure/allergies-api.service';
import { VitalSignsApiService } from '../infrastructure/vital-signs-api.service';

@Injectable({
  providedIn: 'root'
})
export class HealthStore {
  private readonly _allergiesSignal = signal<Allergy[]>([]);
  private readonly _vitalSignsSignal = signal<VitalSign[]>([]);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly allergies = this._allergiesSignal.asReadonly();
  readonly vitalSigns = this._vitalSignsSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  constructor(
    private allergiesApiService: AllergiesApiService,
    private vitalSignsApiService: VitalSignsApiService
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

  loadVitalSignsByResident(residentId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.vitalSignsApiService.getVitalSignsByResidentId(residentId).subscribe({
      next: (vitalSigns) => {
        this._vitalSignsSignal.set(vitalSigns);
        this._loadingSignal.set(false);
      },
      error: () => {
        this._errorSignal.set('Could not load vital signs.');
        this._loadingSignal.set(false);
      }
    });
  }
}
