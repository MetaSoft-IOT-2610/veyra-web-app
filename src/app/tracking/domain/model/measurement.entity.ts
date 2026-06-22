export class Measurement {
  private readonly _id: string;
  private readonly _deviceId: number;
  private readonly _temperature: number | null;
  private readonly _ambientTemperature: number | null;
  private readonly _heartRate: number | null;
  private readonly _oxygenSaturation: number | null;
  private readonly _timestamp: Date;

  constructor(measurement: {
    id: string;
    deviceId: number;
    temperature: number | null;
    ambientTemperature?: number | null;
    heartRate: number | null;
    oxygenSaturation: number | null;
    timestamp: Date;
  }) {
    this._id = measurement.id;
    this._deviceId = measurement.deviceId;
    this._temperature = measurement.temperature;
    this._ambientTemperature = measurement.ambientTemperature ?? null;
    this._heartRate = measurement.heartRate;
    this._oxygenSaturation = measurement.oxygenSaturation;
    this._timestamp = measurement.timestamp;
  }

  get id(): string { return this._id; }
  get deviceId(): number { return this._deviceId; }
  get temperature(): number | null { return this._temperature; }
  get ambientTemperature(): number | null { return this._ambientTemperature; }
  get heartRate(): number | null { return this._heartRate; }
  get oxygenSaturation(): number | null { return this._oxygenSaturation; }
  get timestamp(): Date { return this._timestamp; }

  /** Body temperature when present; otherwise ambient reading from the band. */
  displayTemperature(): number | null {
    return this._temperature ?? this._ambientTemperature;
  }

  hasAnyVital(): boolean {
    return this._heartRate != null
      || this._oxygenSaturation != null
      || this._temperature != null
      || this._ambientTemperature != null;
  }
}
