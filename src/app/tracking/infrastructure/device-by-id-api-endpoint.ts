import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { DeviceAssembler } from './device-assembler';
import { DeviceResource } from './devices-response';

const deviceByIdEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceByIdEndpointPath}`;

function deviceUrl(deviceId: number): string {
  return deviceByIdEndpointUrl.replace('{deviceId}', deviceId.toString());
}

export class DeviceByIdApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new DeviceAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getDeviceById(deviceId: number): Observable<DeviceResource> {
    return this.http.get<DeviceResource>(deviceUrl(deviceId)).pipe(
      map(resource => resource),
      catchError(this.handleError(`Failed to fetch device ${deviceId}`))
    );
  }
}
