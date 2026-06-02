import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Device implements BaseEntity{
  private _id: number;
  private _deviceType: string;
  private _status: string;
   private _residentId: number;
   private _nursingHomeId: number;
  constructor(device: {
    id: number;
    nursingHomeId: number;
    deviceType: string;
    status: string;
     residentId: number;
  }) {
    this._id = device.id;
    this._deviceType = device.deviceType;
    this._status = device.status;
    this._residentId=device.residentId;
    this._nursingHomeId=device.nursingHomeId;

  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }


  get deviceType(): string { return this._deviceType; }
  set deviceType(value: string) { this._deviceType = value; }


  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
  get residentId(): number {
    return this._residentId;
  }

  set residentId(value: number) {
    this._residentId = value;
  }
  get nursingHomeId(): number {
    return this._nursingHomeId;
  }

  set nursingHomeId(value: number) {
    this._nursingHomeId = value;
  }
}
