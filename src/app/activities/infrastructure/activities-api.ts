import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ActivitiesApiEndpoint } from './activities-api-endpoint';
import { Activity } from '../domain/model/activity.entity';
import { Observable } from 'rxjs';
import { NursingHomeAcl } from './acl/nursing-home.acl';

/**
 * API service for the Activities bounded context.
 *
 * Acts as the entry point for all HTTP operations related to activities.
 * Delegates actual HTTP calls to ActivitiesApiEndpoint.
 *
 * Operations available by role:
 * - Administrator (web): getAll, getByResidentId, create, update, delete
 * - Healthcare staff (mobile): complete
 */
@Injectable({
  providedIn: 'root'
})
export class ActivitiesApi extends BaseApi {
  private readonly _activitiesApiEndpoint: ActivitiesApiEndpoint;

  constructor(http: HttpClient, private nursingHomeAcl: NursingHomeAcl) {
    super();
    this._activitiesApiEndpoint = new ActivitiesApiEndpoint(http, nursingHomeAcl);
  }

  /**
   * Retrieves all activities across all residents.
   * @returns Observable emitting an array of Activity entities
   */
  getAll(): Observable<Activity[]> {
    return this._activitiesApiEndpoint.getAll();
  }

  /**
   * Retrieves all activities assigned to a specific resident.
   * @param residentId - ID of the resident to filter by
   * @returns Observable emitting an array of Activity entities
   */
  getByResidentId(residentId: number): Observable<Activity[]> {
    return this._activitiesApiEndpoint.getByResidentId(residentId);
  }

  /**
   * Creates a new activity. Status is forced to PENDING by the backend.
   * @param activity - Activity entity to create
   * @returns Observable emitting the created Activity entity
   */
  create(activity: Activity): Observable<Activity> {
    return this._activitiesApiEndpoint.create(activity);
  }

  /**
   * Updates an existing activity.
   * Only type, title, isRecurring and recurringDays can be modified.
   * @param activity - Activity entity with updated fields
   * @returns Observable emitting the updated Activity entity
   */
  update(activity: Activity): Observable<Activity> {
    return this._activitiesApiEndpoint.update(activity);
  }

  /**
   * Deletes an activity by its ID.
   * @param id - ID of the activity to delete
   * @returns Observable that completes when deletion is confirmed
   */
  delete(id: number): Observable<void> {
    return this._activitiesApiEndpoint.delete(id);
  }

  /**
   * Marks an activity as COMPLETED.
   * Triggered by healthcare staff via the mobile application.
   * @param id - ID of the activity to complete
   * @returns Observable emitting the updated Activity entity
   */
  complete(id: number): Observable<Activity> {
    return this._activitiesApiEndpoint.complete(id);
  }
}
