import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface VitalSignResource extends BaseResource{
  id: number;
  residentId: number;
  measurementId: number;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  respiratoryRate: number;
  registeredAt: string;
  severityLevel: string;
}

export interface VitalSignsResponse extends BaseResponse {
  vitalSign: VitalSignResource[];
}
