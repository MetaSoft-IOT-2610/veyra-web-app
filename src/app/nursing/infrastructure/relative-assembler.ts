import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Relative} from '../domain/model/relative.entity';
import {RelativeResource, RelativeResponse} from './relative-response';

export class RelativeAssembler implements BaseAssembler<Relative,RelativeResource,RelativeResponse>{
  toResourceFromEntity(entity: Relative): RelativeResource {
    const resource: any = {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      residentId: entity.residentId
    };
    resource['nursing-homeId'] = entity.nursingHomeId;
    return resource as RelativeResource;
  }
  toEntitiesFromResponse(response: RelativeResponse): Relative[] {
    return response.relative.map(relative => this.toEntityFromResource(relative));
  }
  toEntityFromResource(resource: RelativeResource): Relative {
    const apiResource: any = resource;
    return new Relative({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      residentId: resource.residentId,
      nursingHomeId: Number(apiResource['nursing-homeId'] ?? 0)
    });
  }
}
