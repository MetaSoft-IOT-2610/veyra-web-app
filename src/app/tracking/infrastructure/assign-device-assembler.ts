import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {AssignDeviceRequest} from './device.request';
import {DeviceResource} from './devices-response';

export class AssignDeviceAssembler {

  toResourceFromResponse(response:DeviceResource):DeviceResource{
    return response;
  }

  toRequestFromCommand(command:AssignDeviceCommand):AssignDeviceRequest{
    return {
      residentId: command.residentId
    } as AssignDeviceRequest
  }

}
