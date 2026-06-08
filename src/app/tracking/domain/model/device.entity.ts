import {BaseEntity} from '../../../shared/domain/model/base-entity';
export class Device implements BaseEntity{
  private _id: number;
  private _deviceType: string;
  private _status: string;
   private _residentId: number | null;
   private _nursingHomeId: number;
   private _macAddress:string;
   private _lastSync:Date;
  constructor(device: {
    id: number;
    nursingHomeId: number;
    deviceType: string;
    status: string;
    macAddress:string;
     residentId: number|null;
     lastSync: Date;
  }) {
    this._id = device.id;
    this._deviceType = device.deviceType;
    this._status = device.status;
    this._residentId=device.residentId;
    this._nursingHomeId=device.nursingHomeId;
    this._macAddress=device.macAddress;
  this._lastSync=device.lastSync;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }


  get deviceType(): string { return this._deviceType; }
  set deviceType(value: string) { this._deviceType = value; }


  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  set residentId(value: number| null) {
    this._residentId = value;
  }
  get nursingHomeId(): number {
    return this._nursingHomeId;
  }

  set nursingHomeId(value: number) {
    this._nursingHomeId = value;
  }
  get lastSync(): Date {
    return this._lastSync;
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
  set lastSync(value: Date) {
    this._lastSync = value;
  }
}
