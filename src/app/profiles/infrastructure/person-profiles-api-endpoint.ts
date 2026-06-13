import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { PersonProfile } from '../domain/model/person-profile.entity';
import { PersonProfileResource, PersonProfilesResponse } from './person-profiles-response';
import { PersonProfileAssembler } from './person-profile-assembler';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, switchMap} from 'rxjs';

const personProfilesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPersonProfilesEndpointPath}`

export class PersonProfilesApiEndpoint extends BaseApiEndpoint<PersonProfile, PersonProfileResource, PersonProfilesResponse, PersonProfileAssembler> {
  constructor(http: HttpClient) {
    super(http, personProfilesEndpointUrl, new PersonProfileAssembler());
  }

  override create(entity: PersonProfile): Observable<PersonProfile> {
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
      return this.http.post<PersonProfileResource>(this.endpointUrl, formData).pipe(
        map(createdResource => this.assembler.toEntityFromResource(createdResource)),
        catchError(this.handleError('Failed to create person profile'))
      );
    } else if (entity.photo && entity.photo.startsWith('http')) {
      // Si es URL, descargarla y enviarla como blob
      return this.http.get(entity.photo, { responseType: 'blob' }).pipe(
        switchMap((blob: Blob) => {
          formData.append('photo', blob, 'photo.jpg');
          return this.http.post<PersonProfileResource>(this.endpointUrl, formData);
        }),
        map(createdResource => this.assembler.toEntityFromResource(createdResource)),
        catchError(this.handleError('Failed to create person profile'))
      );
    } else if (entity.photo) {
      // Si es base64, enviarlo directamente
      formData.append('photo', entity.photo);
    }

    return this.http.post<PersonProfileResource>(this.endpointUrl, formData).pipe(
      map(createdResource => this.assembler.toEntityFromResource(createdResource)),
      catchError(this.handleError('Failed to create person profile'))
    );
  }

   override update(entity: PersonProfile, id: number): Observable<PersonProfile> {
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
      return this.http.put<PersonProfileResource>(`${this.endpointUrl}/${id}`, formData).pipe(
        map(updatedResource => this.assembler.toEntityFromResource(updatedResource)),
        catchError(this.handleError(`Failed to update person profile with id ${id}`))
      );
    } else if (entity.photo && entity.photo.startsWith('http')) {
      // Si es URL, descargarla y enviarla como blob
      return this.http.get(entity.photo, { responseType: 'blob' }).pipe(
        switchMap((blob: Blob) => {
          formData.append('photo', blob, 'photo.jpg');
          return this.http.put<PersonProfileResource>(`${this.endpointUrl}/${id}`, formData);
        }),
        map(updatedResource => this.assembler.toEntityFromResource(updatedResource)),
        catchError(this.handleError(`Failed to update person profile with id ${id}`))
      );
    } else if (entity.photo) {
      // Si es base64, enviarlo directamente
      formData.append('photo', entity.photo);
    }

    return this.http.put<PersonProfileResource>(`${this.endpointUrl}/${id}`, formData).pipe(
      map(updatedResource => this.assembler.toEntityFromResource(updatedResource)),
      catchError(this.handleError(`Failed to update person profile with id ${id}`))
    );
  }
}
