import { DeviceType } from './device-type.enum';

export class CreateDeviceCommand {
  private _deviceId: string;
  private _deviceType: DeviceType;

  constructor(command: { deviceId: string; deviceType: DeviceType }) {
    this._deviceId = command.deviceId;
    this._deviceType = command.deviceType;
  }

  get deviceId(): string { return this._deviceId; }
  set deviceId(value: string) { this._deviceId = value; }

  get deviceType(): DeviceType { return this._deviceType; }
  set deviceType(value: DeviceType) { this._deviceType = value; }
}
