import {UpdateDeviceCommand} from '../domain/model/update-device.command';
import {DevicesApiEndpoint} from './devices-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AssignDeviceAssembler} from './assign-device-assembler';
import {AssignDeviceApiEndpoint} from './assign-device-api-endpoint';
import {DeviceResource} from './devices-response';
import {Observable} from 'rxjs';
import {CreateDeviceApiEndpoint} from './create-device-api-endpoint';
import {CreateDeviceAssembler} from './create-device-assembler';
import {UpdateDeviceApiEndpoint} from './update-device-api-endpoint';
import {UpdateDeviceAssembler} from './update-device-assembler';
import {CreateDeviceCommand} from '../domain/model/create-device.command';
import {Device} from '../domain/model/device.entity';
import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {ChangeDeviceStatusCommand} from '../domain/model/change-device-status.command';
import {ChangeDeviceStatusApiEndpoint} from './change-device-status-api-endpoint';
import {ChangeDeviceStatusAssembler} from './change-device-status-assembler';
@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {

  private readonly devicesEndpoint: DevicesApiEndpoint;
  private readonly assignDeviceEndpoint: AssignDeviceApiEndpoint;
private readonly  createDeviceEndpoint: CreateDeviceApiEndpoint;
private readonly  updateDeviceEndpoint: UpdateDeviceApiEndpoint;
private readonly changeDeviceStatusEndpoint:ChangeDeviceStatusApiEndpoint;
  constructor(http: HttpClient) {
    super();
    this.devicesEndpoint = new DevicesApiEndpoint(http);
   this.createDeviceEndpoint= new CreateDeviceApiEndpoint(http, new CreateDeviceAssembler());
    this.assignDeviceEndpoint = new AssignDeviceApiEndpoint(http,new AssignDeviceAssembler());
    this.updateDeviceEndpoint= new UpdateDeviceApiEndpoint(http, new UpdateDeviceAssembler());
    this.changeDeviceStatusEndpoint=new ChangeDeviceStatusApiEndpoint(http,new ChangeDeviceStatusAssembler());
  }

createDevice( command:CreateDeviceCommand):Observable<DeviceResource>{
    return this.createDeviceEndpoint.createDeviceToNursingHome(command);

}

updateDevice(command:UpdateDeviceCommand):Observable<DeviceResource>{
    return this.updateDeviceEndpoint.updateDevice(command);
}

getDevices(nursingHomeId:number):Observable<Device[]> {
    return this.devicesEndpoint.getDevices(nursingHomeId);
}
assignDevice(command:AssignDeviceCommand):Observable<DeviceResource>{
    return this.assignDeviceEndpoint.assignDeviceToResident(command);

}
  unassignDevice(deviceId:number){
    return this.assignDeviceEndpoint.unassignDeviceFromResident(deviceId);

  }

changeStatusDevice(command:ChangeDeviceStatusCommand){
    return this.changeDeviceStatusEndpoint.changeDeviceStatus(command);
}
}
