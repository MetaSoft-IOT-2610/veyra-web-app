export class VitalSign {
  private _id: number;
  private _residentId: number;
  private _measurementId: string;
  private _temperature: number | null;
  private _heartRate: number | null;
  private _bloodPressure: string | null;
  private _oxygenSaturation: number | null;
  private _respiratoryRate: number | null;
  private _registeredAt: string | null;
  private _severityLevel: string;

  constructor(vitalSign: {
    id: number;
    residentId: number;
    measurementId: string;
    temperature: number | null;
    heartRate: number | null;
    bloodPressure: string | null;
    oxygenSaturation: number | null;
    respiratoryRate: number | null;
    registeredAt: string | null;
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

  get measurementId(): string { return this._measurementId; }
  set measurementId(value: string) { this._measurementId = value; }

  get temperature(): number | null { return this._temperature; }
  set temperature(value: number | null) { this._temperature = value; }

  get heartRate(): number | null { return this._heartRate; }
  set heartRate(value: number | null) { this._heartRate = value; }

  get bloodPressure(): string | null { return this._bloodPressure; }
  set bloodPressure(value: string | null) { this._bloodPressure = value; }

  get oxygenSaturation(): number | null { return this._oxygenSaturation; }
  set oxygenSaturation(value: number | null) { this._oxygenSaturation = value; }

  get respiratoryRate(): number | null { return this._respiratoryRate; }
  set respiratoryRate(value: number | null) { this._respiratoryRate = value; }

  get registeredAt(): string | null { return this._registeredAt; }
  set registeredAt(value: string | null) { this._registeredAt = value; }

  get severityLevel(): string { return this._severityLevel; }
  set severityLevel(value: string) { this._severityLevel = value; }
}
