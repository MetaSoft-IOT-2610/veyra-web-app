export class CreateDeviceCommand {

  private readonly _nursingHomeId: number;
  private readonly _externalDeviceId: string;
  private readonly _deviceType: string;
  private readonly _macAddress:string;
  constructor(command: { nursingHomeId: number; externalDeviceId: string; deviceType: string; macAddress:string }) {
    this._nursingHomeId = command.nursingHomeId;
    this._externalDeviceId = command.externalDeviceId;
    this._deviceType = command.deviceType;
    this._macAddress=command.macAddress;
  }
  get nursingHomeId(): number { return this._nursingHomeId; }
  get externalDeviceId(): string { return this._externalDeviceId; }
  get deviceType(): string { return this._deviceType; }
  get macAddress(): string {
    return this._macAddress;
  }
}
