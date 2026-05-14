import {CreateRelativeCommand} from '../domain/model/create-relative.command';
import {RelativeCommandResource} from './create-relative-command-response';

export class CreateRelativeCommandAssembler {

  toResourceFromEntity(command: CreateRelativeCommand): RelativeCommandResource {
    return {
      name: command.name,
      email: command.email
    } as RelativeCommandResource;
  }
}
