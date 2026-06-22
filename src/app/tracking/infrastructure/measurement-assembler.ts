import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementResource } from './measurements-response';
import { parseUtcTimestamp } from '../../shared/utils/datetime';

export class MeasurementAssembler {
  toEntityFromResource(resource: MeasurementResource): Measurement {
    return new Measurement({
      id: resource.id,
      deviceId: resource.deviceId,
      temperature: resource.temperature,
      ambientTemperature: resource.ambientTemperature ?? null,
      heartRate: resource.heartRate,
      oxygenSaturation: resource.oxygenSaturation,
      timestamp: parseUtcTimestamp(resource.timestamp)
    });
  }

  toEntitiesFromResources(resources: MeasurementResource[]): Measurement[] {
    return resources.map(r => this.toEntityFromResource(r));
  }
}
