import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceAssembler } from './device-assembler';
import {DeviceResource, DevicesResponse} from './devices-response';
import {CreateDeviceRequest, UpdateDeviceRequest} from './device.request';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {catchError, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AssignDeviceResource, AssignDeviceResponse} from './assign-device-response';
import {AssignDeviceAssembler} from './assign-device-assembler';
import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {UpdateDeviceCommand} from '../domain/model/update-device.command';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeDevicesEndpointPath}`;
const assignDeviceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceAssignmentsEndpointPath}`
const devicesEndpointUrl= `${environment.platformProviderApiBaseUrl}${environment.platformProviderDevicesEndpointPath}`;
function nursingHomeDevicesUrl(nursingHomeId: number): string {
  return endpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
}

function assignDeviceEndpoint(deviceId: number): string {
  return assignDeviceEndpointUrl.replace('{deviceId}', deviceId.toString());
}

export class DevicesApiEndpoint extends BaseApiEndpoint<Device, DeviceResource, DevicesResponse, DeviceAssembler> {
constructor(http:HttpClient) {
  super(http,endpointUrl, new DeviceAssembler());
}
  private readonly assignAssembler = new AssignDeviceAssembler();

  getDevices(nursingHomeId:number):Observable<Device[]>{

  return this.http.get<DevicesResponse>(nursingHomeDevicesUrl(nursingHomeId)).pipe
  (map((response)=>this.assembler.toEntitiesFromResponse(response)),catchError(this.handleError(`Failed to fetch devices for nursing home ${nursingHomeId}`)),);
   }

  createDevice(nursingHomeId:number,request:CreateDeviceRequest):Observable<Device>{
    return this.http.post<DeviceResource>(nursingHomeDevicesUrl(nursingHomeId), request).pipe
    (map((resource)=>this.assembler.toEntityFromResource(resource)),catchError(this.handleError(`Failed to register device for nursing home ${nursingHomeId}`)),);
  }
  assignDeviceToResident(deviceId: number, command: AssignDeviceCommand): Observable<AssignDeviceResource> {
    const request = this.assignAssembler.toRequestFromCommand(command);
    return this.http.post<AssignDeviceResponse>(assignDeviceEndpoint(deviceId), request).pipe(
      map(response => this.assignAssembler.toResourceFromResponse(response)),
      catchError(this.handleError(`Failed to assign device ${deviceId} to resident`))
    );
  }

  updateDevice(id: number, command: UpdateDeviceCommand): Observable<Device> {
    const request: UpdateDeviceRequest = {
      deviceType: command.deviceType,
      macAddress: command.macAddress
    };
    return this.http.put<DeviceResource>(`${devicesEndpointUrl}/${id}`, request).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to update device ${id}`))
    );
  }
}
