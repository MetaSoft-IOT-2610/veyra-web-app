export class UpdateDeviceCommand {
  get deviceId(): number {
    return this._deviceId;
  }
  private readonly _deviceId: number;
private readonly  _macAddress:string;
private readonly _deviceType:string;
constructor(command:{deviceId: number;macAddress:string, deviceType:string}) {
 this._macAddress=command.macAddress;
 this._deviceType=command.deviceType;
 this._deviceId=command.deviceId;
}
  get deviceType(): string { return this._deviceType; }
  get macAddress(): string { return this._macAddress; }
}
