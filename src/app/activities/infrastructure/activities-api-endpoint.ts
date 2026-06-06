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
 * The backend exposes two controllers with different scopes:
 *   NursingHomeActivitiesController (collection operations):
 *     GET    /nursing-homes/{nursingHomeId}/activities
 *     POST   /nursing-homes/{nursingHomeId}/activities
 *
 *   ActivitiesController (individual activity operations):
 *     PUT    /activities/{activityId}
 *     DELETE /activities/{activityId}
 *     PATCH  /activities/{activityId}/complete
 *
 * nursingHomeId for collection routes is resolved at call time from localStorage.
 */
export class ActivitiesApiEndpoint extends BaseApiEndpoint<Activity, ActivityResource, ActivitiesResponse, ActivityAssembler> {

  private readonly activityBaseUrl: string;

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderActivitiesEndpointPath}`,
      new ActivityAssembler()
    );
    this.activityBaseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderActivityEndpointPath}`;
  }

  private buildCollectionUrl(): string {
    const nursingHomeId = localStorage.getItem('nursingHomeId') ?? '1';
    return this.endpointUrl.replace('{nursingHomeId}', nursingHomeId);
  }

  override getAll(): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(this.buildCollectionUrl()).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities'))
    );
  }

  override create(activity: Activity): Observable<Activity> {
    const body = this.assembler.toResourceFromEntity(activity);
    return this.http.post<ActivityResource>(this.buildCollectionUrl(), body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create activity'))
    );
  }

  getByResidentId(residentId: number): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(`${this.buildCollectionUrl()}?residentId=${residentId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities by residentId'))
    );
  }

  override update(activity: Activity): Observable<Activity> {
    const body = this.assembler.toResourceFromEntity(activity);
    return this.http.put<ActivityResource>(`${this.activityBaseUrl}/${activity.id}`, body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to update activity with id ${activity.id}`))
    );
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.activityBaseUrl}/${id}`).pipe(
      catchError(this.handleError(`Failed to delete activity with id ${id}`))
    );
  }

  complete(id: number): Observable<Activity> {
    return this.http.patch<ActivityResource>(`${this.activityBaseUrl}/${id}/complete`, {}).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to complete activity with id ${id}`))
    );
  }
}
