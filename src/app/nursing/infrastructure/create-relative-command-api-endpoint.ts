import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {RelativeAssembler} from './relative-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {CreateRelativeCommand} from '../domain/model/create-relative.command';
import {Relative} from '../domain/model/relative.entity';
import {CreateRelativeCommandAssembler} from './create-relative-command-assembler';

const relativeCommandEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResidentRelativesEndpointPath}`;
const relativeEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderRelativesEndpointPath}`;

export class CreateRelativeCommandApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly relativeAssembler = new RelativeAssembler();
  private readonly relativeCommandAssembler = new CreateRelativeCommandAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  //POST: /api/v1/residents/{residentId}/relatives
  create(residentId: number, createRelativeCommand: CreateRelativeCommand): Observable<Relative>{
    const resource = this.relativeCommandAssembler.toResourceFromEntity(createRelativeCommand);
    const url = relativeCommandEndpointUrl.replace('{residentId}', residentId.toString());
    return this.http.post<Relative>(url, resource).pipe(map(createdRelative => this.relativeAssembler.toEntityFromResource(createdRelative)),
    catchError(this.handleError('Failed to create relative')));
  }


  //UPDATE /api/v1/residents/{residentId}/relatives/{relativeId}
  update(residentId: number, relativeId: number, createRelativeCommand: CreateRelativeCommand): Observable<Relative>{
    const resource = this.relativeCommandAssembler.toResourceFromEntity(createRelativeCommand);
    const url = relativeEndpointUrl.replace('{residentId}', residentId.toString()).replace('{relativeId}', relativeId.toString());
    return this.http.put<Relative>(url, resource).pipe(map(updatedRelative => this.relativeAssembler.toEntityFromResource(updatedRelative)),
    catchError(this.handleError('Failed to update relative')));
  }


}
