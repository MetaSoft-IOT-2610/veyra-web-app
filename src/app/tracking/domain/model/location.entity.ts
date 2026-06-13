export class LocationEntity {
  private _id: number;
  private _deviceId: string;
  private _latitude: number;
private _longitude: number
private _timestamp:string;
constructor(location:{id:number,deviceId:string,latitude:number,longitude:number,timestamp:string}) {
  this._id = location.id;
  this._deviceId = location.deviceId;
  this._latitude = location.latitude;
  this._longitude = location.longitude;
  this._timestamp = location.timestamp;
}

  get latitude(): number {
    return this._latitude;
  }

  set latitude(value: number) {
    this._latitude = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  set deviceId(value: string) {
    this._deviceId = value;
  }

  get longitude(): number {
    return this._longitude;
  }

  set longitude(value: number) {
    this._longitude = value;
  }

  get timestamp(): string {
    return this._timestamp;
  }

  set timestamp(value: string) {
    this._timestamp = value;
  }
}

