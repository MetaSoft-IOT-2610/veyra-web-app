import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceAssembler } from './device-assembler';
import { DeviceResource, DevicesResponse } from './devices-response';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeDevicesEndpointPath}`;

function nursingHomeDevicesUrl(nursingHomeId: number): string {
  return endpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
}



export class DevicesApiEndpoint extends BaseApiEndpoint<Device, DeviceResource, DevicesResponse, DeviceAssembler> {

  constructor(http: HttpClient) {
    super(http, endpointUrl, new DeviceAssembler());
  }

  getDevices(nursingHomeId: number): Observable<Device[]> {
    return this.http.get<DevicesResponse>(nursingHomeDevicesUrl(nursingHomeId)).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError(`Failed to fetch devices for nursing home ${nursingHomeId}`))
    );
  }


}
