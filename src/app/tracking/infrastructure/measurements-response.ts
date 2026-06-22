export interface MeasurementResource {
  id: string;
  deviceId: number;
  temperature: number | null;
  ambientTemperature?: number | null;
  heartRate: number | null;
  oxygenSaturation: number | null;
  timestamp: string;
}
