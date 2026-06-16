export class ChangeDeviceStatusCommand {
  private readonly _deviceId: number;
  private readonly _status: string;

  constructor(command: { deviceId: number; status: string }) {
    this._deviceId = command.deviceId;
    this._status = command.status;
  }

  get deviceId(): number { return this._deviceId; }
  get status(): string { return this._status; }
}
