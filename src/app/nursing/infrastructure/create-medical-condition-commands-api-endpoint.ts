import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

import { MedicalConditionAssembler } from './medical-condition-assembler';
import { CreateMedicalConditionCommandAssembler } from './create-medical-condition-command-assembler';

import { MedicalCondition } from '../domain/model/medical-condition.entity';
import { MedicalConditionResource } from './medical-conditions-response';
import { CreateMedicalConditionCommand } from '../domain/model/create-medical-condition.command';

const medicalConditionCommandsEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderResidentMedicalConditionsEndpointPath}`;

/**
 * @purpose: API endpoint for resident medical condition commands.
 * @description: Handles fetching and creating medical conditions associated with a resident.
 */
export class CreateMedicalConditionCommandsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly medicalConditionAssembler = new MedicalConditionAssembler();
  private readonly medicalConditionCommandAssembler = new CreateMedicalConditionCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * GET: /api/v1/residents/{residentId}/medical-conditions
   * @param residentId - Unique identifier of the resident.
   * @returns Observable containing the resident medical conditions.
   */
  getAll(residentId: number): Observable<MedicalCondition[]> {
    const url = medicalConditionCommandsEndpointUrl.replace('{residentId}', residentId.toString());

    return this.http.get<MedicalConditionResource[]>(url).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(resource =>
            this.medicalConditionAssembler.toEntityFromResource(resource)
          );
        }

        return this.medicalConditionAssembler.toEntitiesFromResponse(response);
      }),
      catchError(this.handleError('Failed to fetch medical conditions'))
    );
  }

  /**
   * POST: /api/v1/residents/{residentId}/medical-conditions
   * @param residentId - Unique identifier of the resident.
   * @param createMedicalConditionCommand - Command containing the medical condition data.
   * @returns Observable containing the created medical condition.
   */
  create(
    residentId: number,
    createMedicalConditionCommand: CreateMedicalConditionCommand
  ): Observable<MedicalCondition> {
    const resource = this.medicalConditionCommandAssembler.toResourceFromEntity(
      createMedicalConditionCommand
    );

    const url = medicalConditionCommandsEndpointUrl.replace('{residentId}', residentId.toString());

    return this.http.post<MedicalConditionResource>(url, resource).pipe(
      map(createdMedicalCondition =>
        this.medicalConditionAssembler.toEntityFromResource(createdMedicalCondition)
      ),
      catchError(this.handleError('Failed to create medical condition'))
    );
  }
}
