export class AssignDeviceCommand {
  private readonly _deviceId: number;
  private readonly _residentId: number;

  constructor(command: { deviceId: number; residentId: number }) {
    this._deviceId = command.deviceId;
    this._residentId = command.residentId;
  }

  get deviceId(): number { return this._deviceId; }
  get residentId(): number { return this._residentId; }
}
