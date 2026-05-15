import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceAssembler } from './device-assembler';
import { CreateDeviceCommandAssembler } from './create-device-command-assembler';
import { CreateDeviceCommand } from '../domain/model/create-device.command';
import { DeviceResource } from './devices-response';

const devicesEndpointTemplate = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTrackingDevicesEndpointPath}`;
const baseUrl = `${environment.platformProviderApiBaseUrl}`;

export class CreateDeviceCommandsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly deviceAssembler = new DeviceAssembler();
  private readonly commandAssembler = new CreateDeviceCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  create(nursingHomeId: number, command: CreateDeviceCommand): Observable<Device> {
    const url = devicesEndpointTemplate.replace('{nursingHomeId}', nursingHomeId.toString());
    const resource = this.commandAssembler.toResourceFromEntity(command);
    return this.http.post<DeviceResource>(url, resource).pipe(
      map(r => this.deviceAssembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create device'))
    );
  }

  update(id: number, command: CreateDeviceCommand): Observable<Device> {
    const resource = this.commandAssembler.toResourceFromEntity(command);
    return this.http.put<DeviceResource>(`${baseUrl}/tracking-devices/${id}`, resource).pipe(
      map(r => this.deviceAssembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update device'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/tracking-devices/${id}`).pipe(
      catchError(this.handleError('Failed to delete device'))
    );
  }
}
