import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ActivitiesApiEndpoint } from './activities-api-endpoint';
import { Activity } from '../domain/model/activity.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesApi extends BaseApi {
  private readonly _activitiesApiEndpoint: ActivitiesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._activitiesApiEndpoint = new ActivitiesApiEndpoint(http);
  }

  getAll(): Observable<Activity[]> {
    return this._activitiesApiEndpoint.getAll();
  }

  getByResidentId(residentId: number): Observable<Activity[]> {
    return this._activitiesApiEndpoint.getByResidentId(residentId);
  }

  create(activity: Activity): Observable<Activity> {
    return this._activitiesApiEndpoint.create(activity);
  }

  complete(id: number): Observable<Activity> {
    return this._activitiesApiEndpoint.complete(id);
  }
}
