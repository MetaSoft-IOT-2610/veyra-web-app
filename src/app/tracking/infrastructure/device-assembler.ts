import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Device } from '../domain/model/device.entity';
import { DeviceResource, DevicesResponse } from './devices-response';
import { DeviceStatus } from '../domain/model/device-status.enum';
import { DeviceType } from '../domain/model/device-type.enum';

export class DeviceAssembler implements BaseAssembler<Device, DeviceResource, DevicesResponse> {
  toEntitiesFromResponse(response: DevicesResponse): Device[] {
    return response.device.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      deviceId: resource.deviceId,
      deviceType: resource.deviceType as DeviceType,
      assignedBy: resource.assignedBy,
      assignedAt: resource.assignedAt,
      status: resource.status as DeviceStatus
    });
  }

  toResourceFromEntity(entity: Device): DeviceResource {
    return {
      id: entity.id,
      deviceId: entity.deviceId,
      deviceType: entity.deviceType,
      assignedBy: entity.assignedBy,
      assignedAt: entity.assignedAt,
      status: entity.status
    } as DeviceResource;
  }
}
