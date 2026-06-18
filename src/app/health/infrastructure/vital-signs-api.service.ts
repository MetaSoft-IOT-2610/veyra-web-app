import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VitalSign } from '../domain/model/vital-sign.entity';
import { HealthApiEndpoint } from './health-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class VitalSignsApiService {
  constructor(private http: HttpClient) {}

  getVitalSigns(): Observable<VitalSign[]> {
    return this.http.get<VitalSign[]>(HealthApiEndpoint.vitalSigns);
  }

  getVitalSignById(id: number): Observable<VitalSign> {
    return this.http.get<VitalSign>(`${HealthApiEndpoint.vitalSigns}/${id}`);
  }

  getVitalSignsByResidentId(residentId: number): Observable<VitalSign[]> {
    return this.http.get<VitalSign[]>(HealthApiEndpoint.residentVitalSigns(residentId));
  }
}
