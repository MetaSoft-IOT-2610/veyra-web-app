import { CreateDeviceCommand } from '../domain/model/create-device.command';
import { DeviceResource } from './devices-response';

export class CreateDeviceCommandAssembler {
  toResourceFromEntity(command: CreateDeviceCommand): Partial<DeviceResource> {
    return {
      deviceId: command.deviceId,
      deviceType: command.deviceType
    };
  }
}
