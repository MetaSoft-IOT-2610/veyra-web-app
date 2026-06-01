import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map, catchError, switchMap } from 'rxjs';
import { Resident } from '../domain/model/resident.entity';
import { ResidentAssembler } from './resident-assembler';
import { environment } from '../../../environments/environment';
import { ResidentsResource } from './residents-response';
import { CreateResidentCommand } from '../domain/model/create-resident.command';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { CreateResidentCommandAssembler } from './create-resident-command-assembler';

const residentCommandsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeResidentsEndpointPath}`;
const residentsEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResidentsEndpointPath}`

export class CreateResidentCommandsApiEndpoint extends ErrorHandlingEnabledBaseType{
  private readonly residentAssembler = new ResidentAssembler();
  private readonly residentCommandAssembler = new CreateResidentCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  /** GET: /api/v1/nursing-homes/{nursingHomeId}/residents */
  getAll(nursingHomeId: number): Observable<Resident[]> {
    const url = residentCommandsEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
    return this.http.get<ResidentsResource[]>(url).pipe(
      map(response => {
        if(Array.isArray(response)) {
          return response.map(resource => this.residentAssembler.toEntityFromResource(resource));
        }
        return this.residentAssembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch residents'))
    );
  }

  /** POST: /api/v1/nursing-homes/{nursingHomeId}/residents */
  create(nursingHomeId: number, createResidentCommand: CreateResidentCommand): Observable<Resident> {
    const resource = this.residentCommandAssembler.toResourceFromEntity(createResidentCommand);
    const url = residentCommandsEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());

    const formData = new FormData();
    Object.keys(resource).forEach(key => {
      const value = (resource as any)[key];
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (createResidentCommand.photoFile) {
      formData.append('photo', createResidentCommand.photoFile);
      return this.http.post<Resident>(url, formData).pipe(
        map(createdResident => this.residentAssembler.toEntityFromResource(createdResident)),
        catchError(this.handleError('Failed to create resident'))
      );
    } else if (createResidentCommand.photo && createResidentCommand.photo.startsWith('http')) {
      // Si es URL, descargarla y enviarla como blob
      return this.http.get(createResidentCommand.photo, { responseType: 'blob' }).pipe(
        switchMap((blob: Blob) => {
          formData.append('photo', blob, 'photo.jpg');
          return this.http.post<Resident>(url, formData);
        }),
        map(createdResident => this.residentAssembler.toEntityFromResource(createdResident)),
        catchError(this.handleError('Failed to create resident'))
      );
    } else if (createResidentCommand.photo) {
      // Si es base64, enviarlo directamente
      formData.append('photo', createResidentCommand.photo);
    }

    return this.http.post<Resident>(url, formData).pipe(
      map(createdResident => this.residentAssembler.toEntityFromResource(createdResident)),
      catchError(this.handleError('Failed to create resident'))
    );
  }

  /** PUT: /api/v1/residents/{residentId} */
  update(residentId: number, createResidentCommand: CreateResidentCommand): Observable<Resident> {
    const resource = this.residentCommandAssembler.toResourceFromEntity(createResidentCommand);
    const url = residentsEndpointUrl + `/${residentId}`

    const formData = new FormData();
    Object.keys(resource).forEach(key => {
      const value = (resource as any)[key];
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (createResidentCommand.photoFile) {
      formData.append('photo', createResidentCommand.photoFile);
      return this.http.put<Resident>(url, formData).pipe(
        map(updatedResident => this.residentAssembler.toEntityFromResource(updatedResident)),
        catchError(this.handleError(`Failed to update resident with id ${residentId}`))
      );
    } else if (createResidentCommand.photo && createResidentCommand.photo.startsWith('http')) {
      // Si es URL, descargarla y enviarla como blob
      return this.downloadPhotoAndUpdate(createResidentCommand.photo, url, formData);
    } else if (createResidentCommand.photo) {
      // Si es base64, enviarlo directamente
      formData.append('photo', createResidentCommand.photo);
      return this.http.put<Resident>(url, formData).pipe(
        map(updatedResident => this.residentAssembler.toEntityFromResource(updatedResident)),
        catchError(this.handleError(`Failed to update resident with id ${residentId}`))
      );
    }

    // Sin foto, no se puede actualizar (backend requiere photo)
    return this.http.put<Resident>(url, formData).pipe(
      map(updatedResident => this.residentAssembler.toEntityFromResource(updatedResident)),
      catchError(this.handleError(`Failed to update resident with id ${residentId}`))
    );
  }

  private downloadPhotoAndUpdate(photoUrl: string, url: string, formData: FormData): Observable<Resident> {
    return this.http.get(photoUrl, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob) => {
        formData.append('photo', blob, 'photo.jpg');
        return this.http.put<Resident>(url, formData);
      }),
      map(updatedResident => this.residentAssembler.toEntityFromResource(updatedResident)),
      catchError(this.handleError('Failed to update resident'))
    );
  }

  /** GET: /api/v1/nursing-homes/{nursingHomeId}/residents?state=active */
  getByActiveState(nursingHomeId: number): Observable<Resident[]> {
    const url = residentCommandsEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString()) + '?state=active';
    return this.http.get<ResidentsResource[]>(url).pipe(
      map(response => {
        if(Array.isArray(response)) {
          return response.map(resource => this.residentAssembler.toEntityFromResource(resource));
        }
        return this.residentAssembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch active residents'))
    );
  }
}
