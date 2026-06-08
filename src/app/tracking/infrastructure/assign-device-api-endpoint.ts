import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { DeviceResource } from './devices-response';
import { AssignDeviceCommand } from '../domain/model/assign-device.command';
import { AssignDeviceAssembler } from './assign-device-assembler';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const assignDeviceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceAssignmentsEndpointPath}`;

function assignDeviceUrl(deviceId: number): string {
  return assignDeviceEndpointUrl.replace('{deviceId}', deviceId.toString());
}

export class AssignDeviceApiEndpoint extends ErrorHandlingEnabledBaseType {

  constructor(
    private http: HttpClient,
    private assembler: AssignDeviceAssembler
  ) {
    super();
  }

  assignDeviceToResident(command: AssignDeviceCommand): Observable<DeviceResource> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.post<DeviceResource>(assignDeviceUrl(command.deviceId), request).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError(`Failed to assign device ${command.deviceId} to resident`))
    );
  }

  unassignDeviceFromResident(deviceId: number): Observable<void> {
    return this.http.delete<void>(assignDeviceUrl(deviceId)).pipe(
      catchError(this.handleError(`Failed to unassign device ${deviceId}`))
    );
  }
}
