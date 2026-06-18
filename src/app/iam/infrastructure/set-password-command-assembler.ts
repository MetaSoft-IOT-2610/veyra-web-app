import { SetPasswordCommand } from '../domain/model/set-password.command';
import {SetPasswordRequest} from './set-password-request';

/**
 * Assembler for converting between set-password domain models and API request models.
 */
export class SetPasswordCommandAssembler {
  /**
   * Converts a set-password command to a set-password request for the API.
   * @param command - The domain command.
   * @returns The API request.
   */
  toRequestFromCommand(command: SetPasswordCommand): SetPasswordRequest {
    return {
      token: command.token,
      password: command.password
    } as SetPasswordRequest;
  }
}
