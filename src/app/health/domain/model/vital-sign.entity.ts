export class VitalSign {
  id: number;
  residentId: number;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  respiratoryRate: number;
  registeredAt: string;
  status: string;

  constructor() {
    this.id = 0;
    this.residentId = 0;
    this.temperature = 0;
    this.heartRate = 0;
    this.bloodPressure = '';
    this.oxygenSaturation = 0;
    this.respiratoryRate = 0;
    this.registeredAt = '';
    this.status = '';
  }
}
