import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ActivityResource, ActivitiesResponse } from './activities-response';
import { Activity, ActivityType, ActivityStatus } from '../domain/model/activity.entity';

export class ActivityAssembler implements BaseAssembler<Activity, ActivityResource, ActivitiesResponse> {
  toEntityFromResource(resource: ActivityResource): Activity {
    return new Activity({
      id: resource.id,
      residentId: resource.residentId,
      healthcareStaffId: resource.healthcareStaffId,
      type: resource.type as ActivityType,
      status: resource.status as ActivityStatus,
    });
  }

  toResourceFromEntity(entity: Activity): ActivityResource {
    return {
      id: entity.id,
      residentId: entity.residentId,
      healthcareStaffId: entity.healthcareStaffId,
      type: entity.type,
      status: entity.status,
    };
  }

  toEntitiesFromResponse(response: ActivitiesResponse): Activity[] {
    return response.activities.map(r => this.toEntityFromResource(r));
  }
}
