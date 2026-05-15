import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface RelativeResource extends BaseResource{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  residentId: number;
  'nursing-homeId'?: number | string;
}

export interface RelativeResponse extends BaseResponse {
  relative: RelativeResource[];
}
