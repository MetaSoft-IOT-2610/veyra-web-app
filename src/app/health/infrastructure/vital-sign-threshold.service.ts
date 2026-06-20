import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VitalSignThreshold } from '../domain/model/vital-sign-threshold.entity';
import { HealthApiEndpoint } from './health-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class VitalSignThresholdService {
  constructor(private http: HttpClient) {}

  getThresholdByResident(residentId: number): Observable<VitalSignThreshold> {
    return this.http.get<VitalSignThreshold>(HealthApiEndpoint.residentVitalSignThreshold(residentId));
  }

  createThreshold(residentId: number, threshold: VitalSignThreshold): Observable<VitalSignThreshold> {
    return this.http.post<VitalSignThreshold>(
      HealthApiEndpoint.residentVitalSignThreshold(residentId),
      threshold
    );
  }

  updateThreshold(residentId: number, threshold: VitalSignThreshold): Observable<VitalSignThreshold> {
    return this.http.put<VitalSignThreshold>(
      `${HealthApiEndpoint.residentVitalSignThreshold(residentId)}/${threshold.id}`,
      threshold
    );
  }
}
