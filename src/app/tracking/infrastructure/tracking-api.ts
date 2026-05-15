import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Device } from '../domain/model/device.entity';
import { CreateDeviceCommand } from '../domain/model/create-device.command';
import { DevicesApiEndpoint } from './devices-api-endpoint';
import { CreateDeviceCommandsApiEndpoint } from './create-device-commands-api-endpoint';

@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {
  private readonly _devicesApiEndpoint: DevicesApiEndpoint;
  private readonly _createDeviceCommandsApiEndpoint: CreateDeviceCommandsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._devicesApiEndpoint = new DevicesApiEndpoint(http);
    this._createDeviceCommandsApiEndpoint = new CreateDeviceCommandsApiEndpoint(http);
  }

  getDevices(nursingHomeId: number): Observable<Device[]> {
    return this._devicesApiEndpoint.getAll(nursingHomeId);
  }

  createDevice(nursingHomeId: number, command: CreateDeviceCommand): Observable<Device> {
    return this._createDeviceCommandsApiEndpoint.create(nursingHomeId, command);
  }

  updateDevice(id: number, command: CreateDeviceCommand): Observable<Device> {
    return this._createDeviceCommandsApiEndpoint.update(id, command);
  }

  deleteDevice(id: number): Observable<void> {
    return this._createDeviceCommandsApiEndpoint.delete(id);
  }
}
