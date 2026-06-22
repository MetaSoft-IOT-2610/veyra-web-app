import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Device implements BaseEntity {
  private _id: number;
  private _externalDeviceId: string;
  private _deviceType: string;
  private _status: string;
  private _iotStatus: string;
  private _residentId: number | null;
  private _nursingHomeId: number;
  private _macAddress: string;
  private _assignedAt: Date | null;

  constructor(device: {
    id: number;
    externalDeviceId: string;
    nursingHomeId: number;
    deviceType: string;
    status: string;
    iotStatus: string;
    macAddress: string;
    residentId: number | null;
    assignedAt: Date | null;
  }) {
    this._id = device.id;
    this._externalDeviceId = device.externalDeviceId;
    this._deviceType = device.deviceType;
    this._status = device.status;
    this._iotStatus = device.iotStatus;
    this._residentId = device.residentId;
    this._nursingHomeId = device.nursingHomeId;
    this._macAddress = device.macAddress;
    this._assignedAt = device.assignedAt;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get externalDeviceId(): string {
    return this._externalDeviceId;
  }

  set externalDeviceId(value: string) {
    this._externalDeviceId = value;
  }

  get deviceType(): string {
    return this._deviceType;
  }

  set deviceType(value: string) {
    this._deviceType = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get iotStatus(): string {
    return this._iotStatus;
  }

  set iotStatus(value: string) {
    this._iotStatus = value;
  }

  set residentId(value: number | null) {
    this._residentId = value;
  }

  get nursingHomeId(): number {
    return this._nursingHomeId;
  }

  set nursingHomeId(value: number) {
    this._nursingHomeId = value;
  }

  get assignedAt(): Date | null {
    return this._assignedAt;
  }

  get residentId(): number | null {
    return this._residentId;
  }

  get macAddress(): string {
    return this._macAddress;
  }

  set macAddress(value: string) {
    this._macAddress = value;
  }

  set assignedAt(value: Date | null) {
    this._assignedAt = value;
  }
}
