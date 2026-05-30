import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AlertResource, AlertsResponse } from './alerts-response';
import { Alert, AlertSeverity, AlertSource, AlertStatus, AlertType } from '../domain/model/alert.entity';

/**
 * Transforms between Alert domain entities and API resource/response DTOs.
 */
export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertsResponse> {
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      nursingHomeId: resource.nursingHomeId,
      residentId: resource.residentId,
      residentName: resource.residentName,
      roomNumber: resource.roomNumber,
      title: resource.title,
      description: resource.description,
      severity: resource.severity as AlertSeverity,
      type: resource.type as AlertType,
      source: resource.source as AlertSource,
      status: resource.status as AlertStatus,
      reportedBy: resource.reportedBy,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      nursingHomeId: entity.nursingHomeId,
      residentId: entity.residentId,
      residentName: entity.residentName,
      roomNumber: entity.roomNumber,
      title: entity.title,
      description: entity.description,
      severity: entity.severity,
      type: entity.type,
      source: entity.source,
      status: entity.status,
      reportedBy: entity.reportedBy,
      createdAt: entity.createdAt,
    } as AlertResource;
  }

  toEntitiesFromResponse(response: AlertsResponse): Alert[] {
    return response.alerts.map(r => this.toEntityFromResource(r));
  }
}
