import {UpdateDeviceCommand} from '../domain/model/update-device.command';
import {DevicesApiEndpoint} from './devices-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AssignDeviceAssembler} from './assign-device-assembler';
import {AssignDeviceApiEndpoint} from './assign-device-api-endpoint';
import {DeviceResource} from './devices-response';
import {map, Observable} from 'rxjs';
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
import {ChangeIotStatusCommand} from '../domain/model/change-iot-status.command';
import {ChangeIotStatusApiEndpoint} from './change-iot-status-api-endpoint';
import {ChangeIotStatusAssembler} from './change-iot-status-assembler';
import {DeviceByIdApiEndpoint} from './device-by-id-api-endpoint';
import {MeasurementsApiEndpoint} from './measurements-api-endpoint';
import {Measurement} from '../domain/model/measurement.entity';
import {DeviceAssembler} from './device-assembler';

@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {

  private readonly devicesEndpoint: DevicesApiEndpoint;
  private readonly assignDeviceEndpoint: AssignDeviceApiEndpoint;
  private readonly createDeviceEndpoint: CreateDeviceApiEndpoint;
  private readonly updateDeviceEndpoint: UpdateDeviceApiEndpoint;
  private readonly changeDeviceStatusEndpoint: ChangeDeviceStatusApiEndpoint;
  private readonly changeIotStatusEndpoint: ChangeIotStatusApiEndpoint;
  private readonly deviceByIdEndpoint: DeviceByIdApiEndpoint;
  private readonly measurementsEndpoint: MeasurementsApiEndpoint;
  private readonly deviceAssembler = new DeviceAssembler();

  constructor(http: HttpClient) {
    super();
    this.devicesEndpoint = new DevicesApiEndpoint(http);
    this.createDeviceEndpoint = new CreateDeviceApiEndpoint(http, new CreateDeviceAssembler());
    this.assignDeviceEndpoint = new AssignDeviceApiEndpoint(http, new AssignDeviceAssembler());
    this.updateDeviceEndpoint = new UpdateDeviceApiEndpoint(http, new UpdateDeviceAssembler());
    this.changeDeviceStatusEndpoint = new ChangeDeviceStatusApiEndpoint(http, new ChangeDeviceStatusAssembler());
    this.changeIotStatusEndpoint = new ChangeIotStatusApiEndpoint(http, new ChangeIotStatusAssembler());
    this.deviceByIdEndpoint = new DeviceByIdApiEndpoint(http);
    this.measurementsEndpoint = new MeasurementsApiEndpoint(http);
  }

  createDevice(command: CreateDeviceCommand): Observable<DeviceResource> {
    return this.createDeviceEndpoint.createDeviceToNursingHome(command);
  }

  updateDevice(command: UpdateDeviceCommand): Observable<DeviceResource> {
    return this.updateDeviceEndpoint.updateDevice(command);
  }

  getDevices(nursingHomeId: number): Observable<Device[]> {
    return this.devicesEndpoint.getDevices(nursingHomeId);
  }

  getDeviceById(deviceId: number): Observable<Device> {
    return this.deviceByIdEndpoint.getDeviceById(deviceId).pipe(
      map(resource => this.deviceAssembler.toEntityFromResource(resource))
    );
  }

  assignDevice(command: AssignDeviceCommand): Observable<DeviceResource> {
    return this.assignDeviceEndpoint.assignDeviceToResident(command);
  }

  unassignDevice(deviceId: number) {
    return this.assignDeviceEndpoint.unassignDeviceFromResident(deviceId);
  }

  changeStatusDevice(command: ChangeDeviceStatusCommand) {
    return this.changeDeviceStatusEndpoint.changeDeviceStatus(command);
  }

  changeIotStatus(command: ChangeIotStatusCommand): Observable<DeviceResource> {
    return this.changeIotStatusEndpoint.changeIotStatus(command);
  }

  getDeviceMeasurements(deviceId: number, limit = 50): Observable<Measurement[]> {
    return this.measurementsEndpoint.getDeviceMeasurements(deviceId, limit);
  }
}
