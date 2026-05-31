import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {RelativeAssembler} from './relative-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateRelativeCommand} from '../domain/model/create-relative.command';
import {Relative} from '../domain/model/relative.entity';
import {CreateRelativeCommandAssembler} from './create-relative-command-assembler';

const relativeCommandEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomeRelativesEndpointPath}`;

export class CreateRelativeCommandApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly relativeAssembler = new RelativeAssembler();
  private readonly relativeCommandAssembler = new CreateRelativeCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  //POST: /api/v1/nursing-homes/{nursingHomeId}/relatives
  create(nursingHomeId: number, createRelativeCommand: CreateRelativeCommand): Observable<Relative> {
    const resource = this.relativeCommandAssembler.toResourceFromEntity(createRelativeCommand);
    const url = relativeCommandEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
    const payload = { ...resource, 'nursing-homeId': nursingHomeId };
    return this.http.post<Relative>(url, payload).pipe(
      map(createdRelative => this.relativeAssembler.toEntityFromResource(createdRelative)),
      catchError(this.handleError('Failed to create relative'))
    );
  }

  //UPDATE /api/v1/nursing-homes/{nursingHomeId}/relatives/{relativeId}
  update(nursingHomeId: number, relativeId: number, createRelativeCommand: CreateRelativeCommand): Observable<Relative> {
    const resource = this.relativeCommandAssembler.toResourceFromEntity(createRelativeCommand);
    const url = `${relativeCommandEndpointUrl}/${relativeId}`.replace('{nursingHomeId}', nursingHomeId.toString());
    const payload = { ...resource, 'nursing-homeId': nursingHomeId };
    return this.http.put<Relative>(url, payload).pipe(
      map(updatedRelative => this.relativeAssembler.toEntityFromResource(updatedRelative)),
      catchError(this.handleError('Failed to update relative'))
    );
  }

}
