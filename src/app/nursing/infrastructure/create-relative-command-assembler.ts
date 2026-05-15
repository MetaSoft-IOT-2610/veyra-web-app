import {CreateRelativeCommand} from '../domain/model/create-relative.command';
import {RelativeCommandResource} from './create-relative-command-response';

export class CreateRelativeCommandAssembler {

  toResourceFromEntity(command: CreateRelativeCommand): RelativeCommandResource {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      // Use a safe cast to avoid TS errors if the class does not expose the property
      residentId: (command as any).residentId
    } as RelativeCommandResource;
  }
}
