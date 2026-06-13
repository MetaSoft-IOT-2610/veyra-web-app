export interface MedicalConditionResource {
  id: number;
  residentId: number;
  diagnosisName: string;
  diagnosisDate: string;
  status: string;
  notes: string;
}

export type MedicalConditionsResponse = MedicalConditionResource[];
