import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface VitalSignResource extends BaseResource{
  id: number;
  residentId: number;
  measurementId: string;
  temperature: number | null;
  heartRate: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  bloodPressure?: string | null;
  oxygenSaturation: number | null;
  respiratoryRate: number | null;
  registeredAt: string | null;
  severityLevel: string;
}

export interface VitalSignsResponse extends BaseResponse {
  vitalSign: VitalSignResource[];
}

export interface VitalSignsPageResponse {
  content: VitalSignResource[];
}
