export class VitalSign {
  private _id: number;
  private _residentId: number;
  private _measurementId: number;
  private _temperature: number;
  private _heartRate: number;
  private _bloodPressure: string;
  private _oxygenSaturation: number;
  private _respiratoryRate: number;
  private _registeredAt: string;
  private _severityLevel: string;

  constructor(vitalSign: {
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
  }) {
    this._id = vitalSign.id;
    this._residentId = vitalSign.residentId;
    this._measurementId = vitalSign.measurementId;
    this._temperature = vitalSign.temperature;
    this._heartRate = vitalSign.heartRate;
    this._bloodPressure = vitalSign.bloodPressure;
    this._oxygenSaturation = vitalSign.oxygenSaturation;
    this._respiratoryRate = vitalSign.respiratoryRate;
    this._registeredAt = vitalSign.registeredAt;
    this._severityLevel = vitalSign.severityLevel;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get residentId(): number { return this._residentId; }
  set residentId(value: number) { this._residentId = value; }

  get measurementId(): number { return this._measurementId; }
  set measurementId(value: number) { this._measurementId = value; }

  get temperature(): number { return this._temperature; }
  set temperature(value: number) { this._temperature = value; }

  get heartRate(): number { return this._heartRate; }
  set heartRate(value: number) { this._heartRate = value; }

  get bloodPressure(): string { return this._bloodPressure; }
  set bloodPressure(value: string) { this._bloodPressure = value; }

  get oxygenSaturation(): number { return this._oxygenSaturation; }
  set oxygenSaturation(value: number) { this._oxygenSaturation = value; }

  get respiratoryRate(): number { return this._respiratoryRate; }
  set respiratoryRate(value: number) { this._respiratoryRate = value; }

  get registeredAt(): string { return this._registeredAt; }
  set registeredAt(value: string) { this._registeredAt = value; }

  get severityLevel(): string { return this._severityLevel; }
  set severityLevel(value: string) { this._severityLevel = value; }
}