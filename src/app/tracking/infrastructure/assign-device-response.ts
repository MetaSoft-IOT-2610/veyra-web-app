import { BaseResponse} from '../../shared/infrastructure/base-response';

export interface AssignDeviceResource {
  deviceId:number;
  residentId:number;
}
export interface AssignDeviceResponse extends BaseResponse,AssignDeviceResource{}
