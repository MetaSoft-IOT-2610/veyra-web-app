import { ChangeIotStatusCommand } from '../domain/model/change-iot-status.command';
import { ChangeIotStatusRequest } from './device.request';
import { DeviceResource } from './devices-response';

export class ChangeIotStatusAssembler {
  toResourceFromResponse(response: DeviceResource): DeviceResource {
    return response;
  }

  toRequestFromCommand(command: ChangeIotStatusCommand): ChangeIotStatusRequest {
    return { iotStatus: command.iotStatus };
  }
}
