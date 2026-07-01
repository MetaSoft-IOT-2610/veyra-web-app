import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { VitalSignThreshold } from '../domain/model/vital-sign-threshold.entity';
import { HealthApiEndpoint } from './health-api-endpoint';

interface VitalSignThresholdResource {
  id: number;
  residentId: number;
  heartRateMin: number | null;
  heartRateMax: number | null;
  systolicMax: number | null;
  diastolicMax: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  oxygenSaturationMin: number | null;
  respiratoryRateMin: number | null;
  respiratoryRateMax: number | null;
}

interface SaveVitalSignThresholdResource {
  heartRateMin: number | null;
  heartRateMax: number | null;
  systolicMax: number | null;
  diastolicMax: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  oxygenSaturationMin: number | null;
  respiratoryRateMin: number | null;
  respiratoryRateMax: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class VitalSignThresholdService {
  constructor(private http: HttpClient) {}

  getThresholdByResident(residentId: number): Observable<VitalSignThreshold> {
    return this.http
      .get<VitalSignThresholdResource>(HealthApiEndpoint.residentVitalSignThreshold(residentId))
      .pipe(map(resource => this.toEntity(resource)));
  }

  createThreshold(residentId: number, threshold: VitalSignThreshold): Observable<VitalSignThreshold> {
    return this.saveThreshold(residentId, threshold);
  }

  updateThreshold(residentId: number, threshold: VitalSignThreshold): Observable<VitalSignThreshold> {
    return this.saveThreshold(residentId, threshold);
  }

  saveThreshold(residentId: number, threshold: VitalSignThreshold): Observable<VitalSignThreshold> {
    return this.http.put<VitalSignThresholdResource>(
      HealthApiEndpoint.residentVitalSignThreshold(residentId),
      this.toResource(threshold)
    ).pipe(map(resource => this.toEntity(resource)));
  }

  private toEntity(resource: VitalSignThresholdResource): VitalSignThreshold {
    return new VitalSignThreshold({
      id: resource.id,
      residentId: resource.residentId,
      minHeartRate: resource.heartRateMin ?? 60,
      maxHeartRate: resource.heartRateMax ?? 100,
      minTemperature: resource.temperatureMin ?? 35.0,
      maxTemperature: resource.temperatureMax ?? 37.5,
      minOxygenSaturation: resource.oxygenSaturationMin ?? 95,
      maxOxygenSaturation: 100,
      minRespiratoryRate: resource.respiratoryRateMin ?? 12,
      maxRespiratoryRate: resource.respiratoryRateMax ?? 20
    });
  }

  private toResource(threshold: VitalSignThreshold): SaveVitalSignThresholdResource {
    return {
      heartRateMin: threshold.minHeartRate,
      heartRateMax: threshold.maxHeartRate,
      systolicMax: null,
      diastolicMax: null,
      temperatureMin: threshold.minTemperature,
      temperatureMax: threshold.maxTemperature,
      oxygenSaturationMin: threshold.minOxygenSaturation,
      respiratoryRateMin: threshold.minRespiratoryRate,
      respiratoryRateMax: threshold.maxRespiratoryRate
    };
  }
}
