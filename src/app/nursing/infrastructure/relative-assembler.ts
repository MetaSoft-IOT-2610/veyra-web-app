import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Relative} from '../domain/model/relative.entity';
import {RelativeResource, RelativeResponse} from './relative-response';

export class RelativeAssembler implements BaseAssembler<Relative,RelativeResource,RelativeResponse>{
  toResourceFromEntity(entity: Relative): RelativeResource {
    return  {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      residentId: entity.residentId,
      userId: entity.userId ?? null
    } as RelativeResource;
  }
  toEntitiesFromResponse(response: RelativeResponse): Relative[] {
    return response.relative.map(relative => this.toEntityFromResource(relative));
  }
  toEntityFromResource(resource: RelativeResource): Relative {
    // Accept both `nursingHomeId` and `nursing-homeId` in case backend returns the hyphenated form
    const nursingHomeId = (resource as any)['nursingHomeId'] ?? (resource as any)['nursing-homeId'] ?? null;
    return new Relative({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      residentId: resource.residentId,
      nursingHomeId: resource.nursingHomeId ?? nursingHomeId,
      userId: resource.userId ?? null
    });
  }
}
