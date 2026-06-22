import { IotStatus } from './iot-status.enum';

export class ChangeIotStatusCommand {
  private readonly _deviceId: number;
  private readonly _iotStatus: IotStatus;

  constructor(command: { deviceId: number; iotStatus: IotStatus }) {
    this._deviceId = command.deviceId;
    this._iotStatus = command.iotStatus;
  }

  get deviceId(): number { return this._deviceId; }
  get iotStatus(): IotStatus { return this._iotStatus; }
}
