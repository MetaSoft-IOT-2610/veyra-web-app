import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {ChangeDeviceStatusAssembler} from './change-device-status-assembler';
import {ChangeDeviceStatusCommand} from '../domain/model/change-device-status.command';
import {catchError, map, Observable} from 'rxjs';
import {DeviceResource} from './devices-response';
import {environment} from '../../../environments/environment';
const changeDeviceStatusEndPointUrl= `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceStatusEndpointPath}`;
function changeDeviceUrl(deviceId:number):string{
  return changeDeviceStatusEndPointUrl.replace('{deviceId}',deviceId.toString());
}
export class ChangeDeviceStatusApiEndpoint extends ErrorHandlingEnabledBaseType{
  constructor(private http:HttpClient,private assembler:ChangeDeviceStatusAssembler) {
    super();
  }

changeDeviceStatus(command:ChangeDeviceStatusCommand):Observable<DeviceResource>{
const request= this.assembler.toRequestFromCommand(command);
return this.http.patch<DeviceResource>(changeDeviceUrl(command.deviceId),request).pipe(
  map(response =>this.assembler.toResourceFromResponse(response)),
  catchError(this.handleError("Failed to change status in device"+ command.deviceId))
)

}
}
