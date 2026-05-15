import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Allergy } from '../domain/model/allergy.entity';
import { HealtApiEndpoint } from './healt-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class AllergiesApiService {
  constructor(private http: HttpClient) {}

  getAllergies(): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(HealtApiEndpoint.allergies);
  }

  getAllergyById(id: number): Observable<Allergy> {
    return this.http.get<Allergy>(`${HealtApiEndpoint.allergies}/${id}`);
  }

  getAllergiesByResidentId(residentId: number): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(HealtApiEndpoint.residentAllergies(residentId));
  }
}
