import {DeviceResource} from './devices-response';
import {UpdateDeviceCommand} from '../domain/model/update-device.command';
import {UpdateDeviceRequest} from './device.request';

export class UpdateDeviceAssembler {
  toResourceFromResponse(response:DeviceResource):DeviceResource{
    return response;
  }
  toRequestFromCommand(command:UpdateDeviceCommand):UpdateDeviceRequest{
    return{
      externalDeviceId: command.externalDeviceId,
      deviceType:command.deviceType,
      macAddress:command.macAddress
    }
  }
}
