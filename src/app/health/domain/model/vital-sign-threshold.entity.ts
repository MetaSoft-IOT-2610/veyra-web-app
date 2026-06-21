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

  constructor() {
    this.id = 0;
    this.residentId = 0;
    this.minTemperature = 35.0;
    this.maxTemperature = 37.5;
    this.minHeartRate = 60;
    this.maxHeartRate = 100;
    this.minOxygenSaturation = 95;
    this.maxOxygenSaturation = 100;
    this.minRespiratoryRate = 12;
    this.maxRespiratoryRate = 20;
  }
}
