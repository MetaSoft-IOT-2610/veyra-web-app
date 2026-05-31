import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
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
    } else if (createResidentCommand.photo) {
      // If no new file, we might want to send the existing URL if the backend handles it,
      // or just skip it if the backend keeps the old one.
      // Usually, if it's FormData, the backend expects the file part.
      // If we don't send it, it might be null.
    }

    return this.http.put<Resident>(url, formData).pipe(
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
