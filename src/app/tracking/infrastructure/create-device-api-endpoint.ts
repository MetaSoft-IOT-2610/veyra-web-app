import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CreateDeviceAssembler} from './create-device-assembler';
import {CreateDeviceCommand} from '../domain/model/create-device.command';
import {DeviceResource} from './devices-response';
import {catchError, map, Observable} from 'rxjs';
const createDeviceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeDevicesEndpointPath}`;
function createDeviceUrl(nursingHomeId:number):string{
  return createDeviceEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
}
export class CreateDeviceApiEndpoint  extends ErrorHandlingEnabledBaseType {
 constructor(private http:HttpClient,private assembler:CreateDeviceAssembler) {
   super();
 }
 createDeviceToNursingHome(command:CreateDeviceCommand):Observable<DeviceResource>{
   const request= this.assembler.toRequestFromCommand(command);
   return this.http.post<DeviceResource>(createDeviceUrl(command.nursingHomeId),request).pipe(
     map(response=>this.assembler.toResourceFromResponse(response)),
     catchError(this.handleError("Failed to create device in nursing home "+command.nursingHomeId))
   );
 }
}
