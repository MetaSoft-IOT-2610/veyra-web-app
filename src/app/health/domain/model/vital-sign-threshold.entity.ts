export class VitalSignThreshold {
  id: number;
  residentId: number;
  minTemperature: number;
  maxTemperature: number;
  minHeartRate: number;
  maxHeartRate: number;
  minOxygenSaturation: number;
  maxOxygenSaturation: number;
  minRespiratoryRate: number;
  maxRespiratoryRate: number;

  constructor(threshold?: Partial<VitalSignThreshold>) {
    this.id = threshold?.id ?? 0;
    this.residentId = threshold?.residentId ?? 0;
    this.minTemperature = threshold?.minTemperature ?? 35.0;
    this.maxTemperature = threshold?.maxTemperature ?? 37.5;
    this.minHeartRate = threshold?.minHeartRate ?? 60;
    this.maxHeartRate = threshold?.maxHeartRate ?? 100;
    this.minOxygenSaturation = threshold?.minOxygenSaturation ?? 95;
    this.maxOxygenSaturation = threshold?.maxOxygenSaturation ?? 100;
    this.minRespiratoryRate = threshold?.minRespiratoryRate ?? 12;
    this.maxRespiratoryRate = threshold?.maxRespiratoryRate ?? 20;
  }
}
