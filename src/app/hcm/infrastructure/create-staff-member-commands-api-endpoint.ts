import { environment } from '../../../environments/environment';
import { StaffMemberAssembler } from './staff-member-assembler';
import { HttpClient } from '@angular/common/http';
import { StaffMember } from '../domain/model/staff-member.entity';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { StaffResource } from './staff-response';
import { CreateStaffMemberCommand } from '../domain/model/create-staff-member.command';
import { CreateStaffMemberCommandAssembler } from './create-staff-member-command-assembler';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const nursingHomeStaffEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeStaffEndpointPath}`;
const staffEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderStaffEndpointPath}`;

export class CreateStaffMemberCommandsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly staffMemberAssembler = new StaffMemberAssembler();
  private readonly staffMemberCommandAssembler = new CreateStaffMemberCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  /** GET: /api/v1/nursing-homes/{nursingHomeId}/staff */
  getAll(nursingHomeId: number): Observable<StaffMember[]> {
    const url = nursingHomeStaffEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
    return this.http.get<StaffResource[]>(url).pipe(
      map(response => {
        if(Array.isArray(response)) {
          return response.map(resource => this.staffMemberAssembler.toEntityFromResource(resource));
        }
        return this.staffMemberAssembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch staff'))
    );
  }

  /** POST: /api/v1/nursing-homes/{nursingHomeId}/staff */
  create(nursingHomeId: number, staffMemberCommand: CreateStaffMemberCommand): Observable<StaffMember> {
    const resource = this.staffMemberCommandAssembler.toResourceFromEntity(staffMemberCommand);
    const url = nursingHomeStaffEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());

    const formData = new FormData();
    Object.keys(resource).forEach(key => {
      const value = (resource as any)[key];
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (staffMemberCommand.photoFile) {
      formData.append('photo', staffMemberCommand.photoFile);
      return this.http.post<StaffMember>(url, formData).pipe(
        map(createdStaffMember => this.staffMemberAssembler.toEntityFromResource(createdStaffMember)),
        catchError(this.handleError('Failed to create staff member'))
      );
    } else if (staffMemberCommand.photo && staffMemberCommand.photo.startsWith('http')) {
      return this.http.get(staffMemberCommand.photo, { responseType: 'blob' }).pipe(
        switchMap((blob: Blob) => {
          formData.append('photo', blob, 'photo.jpg');
          return this.http.post<StaffMember>(url, formData);
        }),
        map(createdStaffMember => this.staffMemberAssembler.toEntityFromResource(createdStaffMember)),
        catchError(this.handleError('Failed to create staff member'))
      );
    } else if (staffMemberCommand.photo) {
      formData.append('photo', staffMemberCommand.photo);
    }

    return this.http.post<StaffMember>(url, formData).pipe(
      map(createdStaffMember => this.staffMemberAssembler.toEntityFromResource(createdStaffMember)),
      catchError(this.handleError('Failed to create staff member'))
    );
  }

  /** PUT: /api/v1/staff/{staffMemberId} */
  update(staffMemberId: number, staffMemberCommand: CreateStaffMemberCommand): Observable<StaffMember> {
    const resource = this.staffMemberCommandAssembler.toResourceFromEntity(staffMemberCommand);
    const url = staffEndpointUrl + `/${staffMemberId}`

    const formData = new FormData();
    Object.keys(resource).forEach(key => {
      const value = (resource as any)[key];
      if (key !== 'photo' && value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (staffMemberCommand.photoFile) {
      formData.append('photo', staffMemberCommand.photoFile);
      return this.http.put<StaffMember>(url, formData).pipe(
        map(updatedStaffMember => this.staffMemberAssembler.toEntityFromResource(updatedStaffMember)),
        catchError(this.handleError(`Failed to update staff member with id ${staffMemberId}`))
      );
    } else if (staffMemberCommand.photo && staffMemberCommand.photo.startsWith('http')) {
      // Si es URL, descargarla y enviarla como blob
      return this.downloadPhotoAndUpdate(staffMemberCommand.photo, url, formData);
    } else if (staffMemberCommand.photo) {
      // Si es base64, enviarlo directamente
      formData.append('photo', staffMemberCommand.photo);
      return this.http.put<StaffMember>(url, formData).pipe(
        map(updatedStaffMember => this.staffMemberAssembler.toEntityFromResource(updatedStaffMember)),
        catchError(this.handleError(`Failed to update staff member with id ${staffMemberId}`))
      );
    }

    // Sin foto, no se puede actualizar (backend requiere photo)
    return this.http.put<StaffMember>(url, formData).pipe(
      map(updatedStaffMember => this.staffMemberAssembler.toEntityFromResource(updatedStaffMember)),
      catchError(this.handleError(`Failed to update staff member with id ${staffMemberId}`))
    );
  }

  private downloadPhotoAndUpdate(photoUrl: string, url: string, formData: FormData): Observable<StaffMember> {
    return this.http.get(photoUrl, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob) => {
        formData.append('photo', blob, 'photo.jpg');
        return this.http.put<StaffMember>(url, formData);
      }),
      map(updatedStaffMember => this.staffMemberAssembler.toEntityFromResource(updatedStaffMember)),
      catchError(this.handleError('Failed to update staff member'))
    );
  }
}
