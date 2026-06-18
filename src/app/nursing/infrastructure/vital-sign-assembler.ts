import {VitalSignResource, VitalSignsResponse} from './vital-signs-response';
import {VitalSign} from '../domain/model/vital-sign.entity';

export class VitalSignAssembler {
  toEntitiesFromResponse(response: VitalSignsResponse): VitalSign[] {
    return response.vitalSign.map(vitalSign => this.toEntityFromResource(vitalSign));
  }

  toEntityFromResource(resource: VitalSignResource): VitalSign {
    return new VitalSign({
      id: resource.id,
      residentId: resource.residentId,
      measurementId: resource.measurementId,
      temperature: resource.temperature,
      heartRate: resource.heartRate,
      bloodPressure: resource.bloodPressure,
      oxygenSaturation: resource.oxygenSaturation,
      respiratoryRate: resource.respiratoryRate,
      registeredAt: resource.registeredAt,
      severityLevel: resource.severityLevel
    });
  }

  toResourceFromEntity(entity: VitalSign): VitalSignResource {
    return {
      id: entity.id,
      residentId: entity.residentId,
      measurementId: entity.measurementId,
      temperature: entity.temperature,
      heartRate: entity.heartRate,
      bloodPressure: entity.bloodPressure,
      oxygenSaturation: entity.oxygenSaturation,
      respiratoryRate: entity.respiratoryRate,
      registeredAt: entity.registeredAt,
      severityLevel: entity.severityLevel
    };
  }
}
