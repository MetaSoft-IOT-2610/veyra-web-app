import {CreateRelativeCommand} from '../domain/model/create-relative.command';
import {RelativeCommandResource} from './create-relative-command-response';

export class CreateRelativeCommandAssembler {

  toResourceFromEntity(command: CreateRelativeCommand): RelativeCommandResource {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      residentId: command.residentId
    } as RelativeCommandResource;
  }
}
