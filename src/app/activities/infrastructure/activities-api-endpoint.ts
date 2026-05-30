import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ActivityResource, ActivitiesResponse } from './activities-response';
import { Activity } from '../domain/model/activity.entity';
import { ActivityAssembler } from './activity-assembler';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export class ActivitiesApiEndpoint extends BaseApiEndpoint<Activity, ActivityResource, ActivitiesResponse, ActivityAssembler> {

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderActivitiesEndpointPath}`,
      new ActivityAssembler()
    );
  }

  getByResidentId(residentId: number): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(`${this.endpointUrl}?residentId=${residentId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch activities by residentId'))
    );
  }

  complete(id: number): Observable<Activity> {
    return this.http.patch<ActivityResource>(`${this.endpointUrl}/${id}/complete`, {}).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to complete activity with id ${id}`))
    );
  }
}
