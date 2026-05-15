import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceAssembler } from './device-assembler';
import { DeviceResource } from './devices-response';

const devicesEndpointTemplate = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTrackingDevicesEndpointPath}`;

export class DevicesApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new DeviceAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getAll(nursingHomeId: number): Observable<Device[]> {
    const url = devicesEndpointTemplate.replace('{nursingHomeId}', nursingHomeId.toString());
    return this.http.get<DeviceResource[]>(url).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(r => this.assembler.toEntityFromResource(r));
        }
        return this.assembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch tracking devices'))
    );
  }
}
