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
 * All routes are scoped to a nursing home:
 *   GET    /nursing-homes/{nursingHomeId}/activities
 *   POST   /nursing-homes/{nursingHomeId}/activities
 *   PUT    /nursing-homes/{nursingHomeId}/activities/{activityId}
 *   DELETE /nursing-homes/{nursingHomeId}/activities/{activityId}
 *   PATCH  /nursing-homes/{nursingHomeId}/activities/{activityId}/complete
 *
 * The nursingHomeId is resolved at call time from localStorage so it
 * reflects the session selected by the user after login.
 */
export class ActivitiesApiEndpoint extends BaseApiEndpoint<Activity, ActivityResource, ActivitiesResponse, ActivityAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderActivitiesEndpointPath}`,
      new ActivityAssembler()
    );
  }

  private buildUrl(): string {
    const nursingHomeId = localStorage.getItem('nursingHomeId') ?? '1';
    return this.endpointUrl.replace('{nursingHomeId}', nursingHomeId);
  }

  override getAll(): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(this.buildUrl()).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities'))
    );
  }

  override create(activity: Activity): Observable<Activity> {
    const body = this.assembler.toResourceFromEntity(activity);
    return this.http.post<ActivityResource>(this.buildUrl(), body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create activity'))
    );
  }

  getByResidentId(residentId: number): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(`${this.buildUrl()}?residentId=${residentId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities by residentId'))
    );
  }

  override update(activity: Activity): Observable<Activity> {
    const body = this.assembler.toResourceFromEntity(activity);
    return this.http.put<ActivityResource>(`${this.buildUrl()}/${activity.id}`, body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to update activity with id ${activity.id}`))
    );
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.buildUrl()}/${id}`).pipe(
      catchError(this.handleError(`Failed to delete activity with id ${id}`))
    );
  }

  complete(id: number): Observable<Activity> {
    return this.http.patch<ActivityResource>(`${this.buildUrl()}/${id}/complete`, {}).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to complete activity with id ${id}`))
    );
  }
}
