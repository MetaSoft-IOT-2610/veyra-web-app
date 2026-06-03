import {AssignDeviceResource, AssignDeviceResponse} from './assign-device-response';
import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {AssignDeviceRequest} from './device.request';

export class AssignDeviceAssembler {
  toResourceFromResponse(response:AssignDeviceResponse):AssignDeviceResource{
    return {
      deviceId:response.deviceId,
      residentId:response.residentId
    } as AssignDeviceResource;

  }
  toRequestFromCommand(command:AssignDeviceCommand):AssignDeviceRequest{
    return {
      deviceId: command.deviceId,
      residentId: command.residentId
    } as AssignDeviceRequest
  }
}
