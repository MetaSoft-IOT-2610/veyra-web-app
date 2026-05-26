import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ActivityResource extends BaseResource {
  id: number;
  residentId: number;
  healthcareStaffId: number;
  type: string;
  status: string;
}

export interface ActivitiesResponse extends BaseResponse {
  activities: ActivityResource[];
}
