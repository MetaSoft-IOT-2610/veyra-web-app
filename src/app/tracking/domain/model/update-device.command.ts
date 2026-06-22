export class UpdateDeviceCommand {
  private readonly _deviceId: number;
  private readonly _externalDeviceId: string;
  private readonly _macAddress: string;
  private readonly _deviceType: string;

  constructor(command: {
    deviceId: number;
    externalDeviceId: string;
    macAddress: string;
    deviceType: string;
  }) {
    this._deviceId = command.deviceId;
    this._externalDeviceId = command.externalDeviceId;
    this._macAddress = command.macAddress;
    this._deviceType = command.deviceType;
  }

  get deviceId(): number {
    return this._deviceId;
  }

  get externalDeviceId(): string {
    return this._externalDeviceId;
  }

  get deviceType(): string {
    return this._deviceType;
  }

  get macAddress(): string {
    return this._macAddress;
  }
}
