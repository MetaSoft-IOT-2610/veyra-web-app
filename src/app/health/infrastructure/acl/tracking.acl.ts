import { VitalSignThreshold } from '../../domain/model/vital-sign-threshold.entity';

export interface VitalSignReading {
  residentId: number;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  respiratoryRate: number;
  registeredAt: string;
}

export interface ThresholdCheckResult {
  isAlert: boolean;
  violations: {
    temperature?: { value: number; min: number; max: number };
    heartRate?: { value: number; min: number; max: number };
    oxygenSaturation?: { value: number; min: number; max: number };
    respiratoryRate?: { value: number; min: number; max: number };
  };
}

export class TrackingAcl {
  fromTrackingVitalSign(raw: {
    residentId: number;
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    oxygenSaturation: number;
    respiratoryRate: number;
    registeredAt: string;
  }): VitalSignReading {
    return { ...raw };
  }

  checkAgainstThreshold(reading: VitalSignReading, threshold: VitalSignThreshold): ThresholdCheckResult {
    const violations: ThresholdCheckResult['violations'] = {};

    if (reading.temperature < threshold.minTemperature || reading.temperature > threshold.maxTemperature) {
      violations.temperature = { value: reading.temperature, min: threshold.minTemperature, max: threshold.maxTemperature };
    }
    if (reading.heartRate < threshold.minHeartRate || reading.heartRate > threshold.maxHeartRate) {
      violations.heartRate = { value: reading.heartRate, min: threshold.minHeartRate, max: threshold.maxHeartRate };
    }
    if (reading.oxygenSaturation < threshold.minOxygenSaturation || reading.oxygenSaturation > threshold.maxOxygenSaturation) {
      violations.oxygenSaturation = { value: reading.oxygenSaturation, min: threshold.minOxygenSaturation, max: threshold.maxOxygenSaturation };
    }
    if (reading.respiratoryRate < threshold.minRespiratoryRate || reading.respiratoryRate > threshold.maxRespiratoryRate) {
      violations.respiratoryRate = { value: reading.respiratoryRate, min: threshold.minRespiratoryRate, max: threshold.maxRespiratoryRate };
    }

    return { isAlert: Object.keys(violations).length > 0, violations };
  }
}
