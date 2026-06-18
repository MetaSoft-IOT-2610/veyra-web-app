import {DeviceResource} from './devices-response';
import {CreateDeviceCommand} from '../domain/model/create-device.command';
import {CreateDeviceRequest} from './device.request';

export class CreateDeviceAssembler {
toResourceFromResponse(response:DeviceResource ):DeviceResource{
  return response;

}
toRequestFromCommand(command:CreateDeviceCommand):CreateDeviceRequest{
 return {
   deviceType:command.deviceType,
   macAddress:command.macAddress

 }as CreateDeviceRequest;
}
}
