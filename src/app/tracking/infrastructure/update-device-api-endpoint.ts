import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UpdateDeviceAssembler} from './update-device-assembler';
import {DeviceResource} from './devices-response';
import {catchError, Observable} from 'rxjs';
import {UpdateDeviceCommand} from '../domain/model/update-device.command';
const updateDeviceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceByIdEndpointPath}`;
function updateDeviceUrl(deviceId:number):string{
return updateDeviceEndpointUrl.replace('{deviceId}', deviceId.toString());
}
export class UpdateDeviceApiEndpoint  extends ErrorHandlingEnabledBaseType  {

constructor(private http:HttpClient,private assembler:UpdateDeviceAssembler) {
  super();
}

updateDevice(command:UpdateDeviceCommand):Observable<DeviceResource>{
  const request= this.assembler.toRequestFromCommand(command);
  return this.http.put<DeviceResource>(updateDeviceUrl(command.deviceId),request).pipe(
    catchError(this.handleError(`Failed to update device ${command.deviceId}`))
  );
}

}
