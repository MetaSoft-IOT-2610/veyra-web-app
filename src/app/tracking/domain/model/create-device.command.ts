export class CreateDeviceCommand {
  private readonly _nursingHomeId: number;
  private readonly _deviceType: string;

  constructor(command: { nursingHomeId: number; deviceType: string }) {
    this._nursingHomeId = command.nursingHomeId;
    this._deviceType = command.deviceType;
  }
  get nursingHomeId(): number { return this._nursingHomeId; }
  get deviceType(): string { return this._deviceType; }
}
