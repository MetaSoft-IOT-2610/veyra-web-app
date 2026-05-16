import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface MonitoringResidentsResource extends BaseResource{
  residentId:number;
  healthId:number;
  doctorId:number;
}
export interface MonitoringResidentsResponse  extends BaseResponse{
  monitoringResidents: MonitoringResidentsResource[];
}
