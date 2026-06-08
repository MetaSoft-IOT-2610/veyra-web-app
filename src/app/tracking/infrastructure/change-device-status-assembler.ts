import {DeviceResource} from './devices-response';
import {ChangeDeviceStatusCommand} from '../domain/model/change-device-status.command';
import {ChangeDeviceStatusRequest} from './device.request';

export class ChangeDeviceStatusAssembler {
  toResourceFromResponse (response : DeviceResource):DeviceResource{
return response;
  }

  toRequestFromCommand(command: ChangeDeviceStatusCommand):ChangeDeviceStatusRequest{
    return {
      status:command.status
    }as ChangeDeviceStatusRequest;
  }
}
