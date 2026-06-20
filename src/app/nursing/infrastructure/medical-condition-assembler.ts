import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

import { MedicalCondition } from '../domain/model/medical-condition.entity';
import {
  MedicalConditionResource,
  MedicalConditionsResponse
} from './medical-conditions-response';

/**
 * @purpose: Transform MedicalCondition resources into domain entities and vice versa.
 * @description: Maps API responses to application entities and converts entities back to resources.
 */
export class MedicalConditionAssembler implements BaseAssembler<
  MedicalCondition,
  MedicalConditionResource,
  MedicalConditionsResponse
> {

  /**
   * Converts an API resource into a domain entity.
   * @param resource - Medical condition resource returned by the API.
   * @returns MedicalCondition entity.
   */
  toEntityFromResource(resource: MedicalConditionResource): MedicalCondition {
    return {
      id: resource.id,
      residentId: resource.residentId,
      diagnosisName: resource.diagnosisName,
      diagnosisDate: resource.diagnosisDate,
      status: resource.status,
      notes: resource.notes
    };
  }

  /**
   * Converts a domain entity into an API resource.
   * @param entity - MedicalCondition entity.
   * @returns MedicalConditionResource.
   */
  toResourceFromEntity(entity: MedicalCondition): MedicalConditionResource {
    return {
      id: entity.id,
      residentId: entity.residentId,
      diagnosisName: entity.diagnosisName,
      diagnosisDate: entity.diagnosisDate,
      status: entity.status,
      notes: entity.notes
    };
  }

  /**
   * Converts an API response collection into a list of entities.
   * @param response - Medical conditions response.
   * @returns List of MedicalCondition entities.
   */
  toEntitiesFromResponse(response: MedicalConditionsResponse): MedicalCondition[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
