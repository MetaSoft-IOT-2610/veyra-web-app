import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DeviceResource extends BaseResource {
  id: number;
  nursingHomeId:number;
  deviceType:string;
  status:string;
  macAddress:string;
  residentId:number;
  assignedAt:Date;
}

export interface DevicesResponse extends BaseResponse {
  devices: DeviceResource[];
}
