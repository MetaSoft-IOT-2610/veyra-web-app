import { CreateMedicalConditionCommand } from '../domain/model/create-medical-condition.command';
import { MedicalConditionCommandResource } from './create-medical-condition-commands-response';

/**
 * @purpose: Convert CreateMedicalConditionCommand into API resources.
 * @description: Maps command objects from the application layer into request payloads expected by the backend.
 */
export class CreateMedicalConditionCommandAssembler {

  /**
   * Converts a CreateMedicalConditionCommand into a resource object.
   * @param command - Command containing the medical condition data.
   * @returns MedicalConditionCommandResource.
   */
  toResourceFromEntity(
    command: CreateMedicalConditionCommand
  ): MedicalConditionCommandResource {
    return {
      diagnosisName: command.diagnosisName,
      diagnosisDate: command.diagnosisDate,
      status: command.status,
      notes: command.notes
    };
  }
}
