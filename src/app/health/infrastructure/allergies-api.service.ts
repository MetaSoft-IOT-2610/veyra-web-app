import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Allergy } from '../domain/model/allergy.entity';
import { HealthApiEndpoint } from './health-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class AllergiesApiService {
  constructor(private http: HttpClient) {}

  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(HealthApiEndpoint.allergies);
  }

  getAllergyById(id: number): Observable<Allergy> {
    return this.http.get<Allergy>(`${HealthApiEndpoint.allergies}/${id}`);
  }

  getAllergiesByResidentId(residentId: number): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(HealthApiEndpoint.residentAllergies(residentId));
  }
}
