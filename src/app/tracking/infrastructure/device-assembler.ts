import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Device } from '../domain/model/device.entity';
import { DeviceResource, DevicesResponse } from './devices-response';

export class DeviceAssembler implements BaseAssembler<Device, DeviceResource, DevicesResponse> {
  toEntitiesFromResponse(response: DevicesResponse): Device[] {
    return response.devices.map(r => this.toEntityFromResource(r as DeviceResource));
  }

  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      nursingHomeId:resource.nursingHomeId,
      deviceType: resource.deviceType,
       status:resource.status,
      macAddress:resource.macAddress,
      residentId:resource.residentId,
      assignedAt:resource.assignedAt,
    });
  }

  toResourceFromEntity(entity: Device): DeviceResource {
    return {
      id: entity.id,
      nursingHomeId:entity.nursingHomeId,
      deviceType: entity.deviceType,
      status: entity.status,
      macAddress: entity.macAddress,
      residentId:entity.residentId,
      assignedAt:entity.assignedAt,
    } as DeviceResource;
  }
}
