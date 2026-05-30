import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BusinessProfile } from '../domain/model/business-profile.entity';
import { BusinessProfileResource, BusinessProfilesResponse } from './business-profiles-response';
import { BusinessProfileAssembler } from './business-profile-assembler';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';

const businessProfilesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderBusinessProfilesEndpointPath}`

export class BusinessProfilesApiEndpoint extends BaseApiEndpoint<BusinessProfile, BusinessProfileResource, BusinessProfilesResponse, BusinessProfileAssembler> {
  constructor(http: HttpClient) {
    super(http, businessProfilesEndpointUrl, new BusinessProfileAssembler());
  }

  override create(entity: BusinessProfile): Observable<BusinessProfile> {
    const resource = this.assembler.toResourceFromEntity(entity);
    const formData = new FormData();

    Object.keys(resource).forEach(key => {
      const value = (resource as any)[key];
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }

    });

    if (entity.photoFile) {
      formData.append('photo', entity.photoFile);
    }

    return this.http.post<BusinessProfileResource>(this.endpointUrl, formData).pipe(
      map(createdResource => this.assembler.toEntityFromResource(createdResource)),
      catchError(this.handleError('Failed to create business profile'))
    );

  }
}
