export class UpdateDeviceCommand {
  private readonly _id: number;
private readonly  _macAddress:string;
private readonly _deviceType:string;
constructor(command:{id: number;macAddress:string, deviceType:string}) {
 this._macAddress=command.macAddress;
 this._deviceType=command.deviceType;
 this._id=command.id;
}
  get id(): number { return this._id; }
  get deviceType(): string { return this._deviceType; }
  get macAddress(): string { return this._macAddress; }
}
