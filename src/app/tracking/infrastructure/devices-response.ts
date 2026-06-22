import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DeviceResource extends BaseResource {
  id: number;
  nursingHomeId: number;
  externalDeviceId: string;
  deviceType: string;
  status: string;
  iotStatus: string;
  macAddress: string;
  residentId: number | null;
  assignedAt: Date | null;
}

export interface DevicesResponse extends BaseResponse {
  devices: DeviceResource[];
}
