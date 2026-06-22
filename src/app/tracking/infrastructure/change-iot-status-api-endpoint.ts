import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { ChangeIotStatusCommand } from '../domain/model/change-iot-status.command';
import { ChangeIotStatusAssembler } from './change-iot-status-assembler';
import { DeviceResource } from './devices-response';

const changeIotStatusEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceIotStatusEndpointPath}`;

function changeIotStatusUrl(deviceId: number): string {
  return changeIotStatusEndpointUrl.replace('{deviceId}', deviceId.toString());
}

export class ChangeIotStatusApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: ChangeIotStatusAssembler
  ) {
    super();
  }

  changeIotStatus(command: ChangeIotStatusCommand): Observable<DeviceResource> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.patch<DeviceResource>(changeIotStatusUrl(command.deviceId), request).pipe(
      map(response => this.assembler.toResourceFromResponse(response)),
      catchError(this.handleError(`Failed to change IoT status for device ${command.deviceId}`))
    );
  }
}
