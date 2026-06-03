import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ActivityResource, ActivitiesResponse } from './activities-response';
import { Activity, ActivityType, ActivityStatus, WeekDay } from '../domain/model/activity.entity';

/**
 * Assembler responsible for converting between ActivityResource (API shape)
 * and Activity (domain entity).
 *
 * Follows the Assembler pattern used across all bounded contexts in Veyra.
 */
export class ActivityAssembler implements BaseAssembler<Activity, ActivityResource, ActivitiesResponse> {

  /**
   * Converts a raw API resource into a domain Activity entity.
   * @param resource - Raw resource object from the backend
   * @returns Hydrated Activity domain entity
   */
  toEntityFromResource(resource: ActivityResource): Activity {
    return new Activity({
      id: resource.id,
      residentId: resource.residentId,
      healthcareStaffId: resource.healthcareStaffId,
      type: resource.type as ActivityType,
      title: resource.title ?? '',
      status: resource.status as ActivityStatus,
      isRecurring: resource.isRecurring ?? false,
      recurringDays: Array.isArray(resource.recurringDays)
        ? (resource.recurringDays as unknown[]).filter(d => d !== null && d !== undefined && d !== '') as WeekDay[]
        : [],
    });
  }

  /**
   * Converts a domain Activity entity into an API resource shape.
   * Used when sending data to the backend (POST, PUT).
   * @param entity - Domain Activity entity
   * @returns Plain resource object matching the API contract
   */
  toResourceFromEntity(entity: Activity): ActivityResource {
    return {
      id: entity.id,
      residentId: entity.residentId,
      healthcareStaffId: entity.healthcareStaffId,
      type: entity.type,
      title: entity.title,
      status: entity.status,
      isRecurring: entity.isRecurring,
      recurringDays: entity.recurringDays,
    };
  }

  /**
   * Converts a full API response envelope into an array of Activity entities.
   * @param response - Full response object from GET /activities
   * @returns Array of hydrated Activity domain entities
   */
  toEntitiesFromResponse(response: ActivitiesResponse): Activity[] {
    return response.activities.map(r => this.toEntityFromResource(r));
  }
}
