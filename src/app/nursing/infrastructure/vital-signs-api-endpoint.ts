import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {VitalSignAssembler} from './vital-sign-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {VitalSign} from '../domain/model/vital-sign.entity';
import {VitalSignResource, VitalSignsPageResponse, VitalSignsResponse} from './vital-signs-response';

const residentVitalSignsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResidentVitalSigsEndpointPath}`

export class VitalSignsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly vitalSignAssembler = new VitalSignAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getAll(residentId: number): Observable<VitalSign[]> {
    const url = residentVitalSignsEndpointUrl.replace('{residentId}', residentId.toString());
    const params = {
      page: 0,
      size: 100,
      startDate: '1970-01-01T00:00:00'
    };

    return this.http.get<VitalSignResource[] | VitalSignsPageResponse | VitalSignsResponse>(url, { params }).pipe(
      map(response => {
        if(Array.isArray(response)) {
          return response.map(resource => this.vitalSignAssembler.toEntityFromResource(resource));
        }

        if ('content' in response && Array.isArray(response.content)) {
          return this.vitalSignAssembler.toEntitiesFromPageResponse(response);
        }

        if ('vitalSign' in response && Array.isArray(response.vitalSign)) {
          return this.vitalSignAssembler.toEntitiesFromResponse(response);
        }

        return [];
      }),
      catchError(this.handleError('Failed to fetch vital signs'))
    )
  }
}
