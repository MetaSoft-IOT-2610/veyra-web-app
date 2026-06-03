import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ActivityResource, ActivitiesResponse } from './activities-response';
import { Activity } from '../domain/model/activity.entity';
import { ActivityAssembler } from './activity-assembler';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * HTTP endpoint handler for the Activities bounded context.
 *
 * Extends BaseApiEndpoint which provides the base CRUD operations:
 * - getAll()   → GET /activities
 * - create()   → POST /activities
 *
 * This class adds the activity-specific endpoints that are not
 * covered by the base implementation.
 */
export class ActivitiesApiEndpoint extends BaseApiEndpoint<Activity, ActivityResource, ActivitiesResponse, ActivityAssembler> {

  /**
   * @param http - Angular HttpClient instance passed from ActivitiesApi
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderActivitiesEndpointPath}`,
      new ActivityAssembler()
    );
  }

  /**
   * Retrieves all activities filtered by a specific resident.
   * @param residentId - ID of the resident to filter by
   * @returns Observable emitting an array of Activity entities
   */
  getByResidentId(residentId: number): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(`${this.endpointUrl}?residentId=${residentId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities by residentId'))
    );
  }

  /**
   * Updates an existing activity by its ID.
   * Only type, title, isRecurring and recurringDays are sent to the backend.
   * @param activity - Activity entity with updated fields
   * @returns Observable emitting the updated Activity entity
   */
  override update(activity: Activity): Observable<Activity> {
    const body = this.assembler.toResourceFromEntity(activity);
    return this.http.put<ActivityResource>(`${this.endpointUrl}/${activity.id}`, body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to update activity with id ${activity.id}`))
    );
  }

  /**
   * Deletes an activity by its ID.
   * @param id - ID of the activity to delete
   * @returns Observable that completes when deletion is confirmed
   */
  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError(`Failed to delete activity with id ${id}`))
    );
  }

  /**
   * Marks an activity as COMPLETED.
   * Triggered by healthcare staff via the mobile application.
   * @param id - ID of the activity to complete
   * @returns Observable emitting the updated Activity entity
   */
  complete(id: number): Observable<Activity> {
    return this.http.patch<ActivityResource>(`${this.endpointUrl}/${id}/complete`, {}).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to complete activity with id ${id}`))
    );
  }
}
