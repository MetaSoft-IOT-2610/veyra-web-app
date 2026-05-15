import { DeviceStatus } from './device-status.enum';
import { DeviceType } from './device-type.enum';

export class Device {
  private _id: number;
  private _deviceId: string;
  private _deviceType: DeviceType;
  private _assignedBy: string;
  private _assignedAt: string;
  private _status: DeviceStatus;

  constructor(device: {
    id: number;
    deviceId: string;
    deviceType: DeviceType;
    assignedBy: string;
    assignedAt: string;
    status: DeviceStatus;
  }) {
    this._id = device.id;
    this._deviceId = device.deviceId;
    this._deviceType = device.deviceType;
    this._assignedBy = device.assignedBy;
    this._assignedAt = device.assignedAt;
    this._status = device.status;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get deviceId(): string { return this._deviceId; }
  set deviceId(value: string) { this._deviceId = value; }

  get deviceType(): DeviceType { return this._deviceType; }
  set deviceType(value: DeviceType) { this._deviceType = value; }

  get assignedBy(): string { return this._assignedBy; }
  set assignedBy(value: string) { this._assignedBy = value; }

  get assignedAt(): string { return this._assignedAt; }
  set assignedAt(value: string) { this._assignedAt = value; }

  get status(): DeviceStatus { return this._status; }
  set status(value: DeviceStatus) { this._status = value; }
}
