import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Relative} from '../domain/model/relative.entity';
import {RelativeResource, RelativeResponse} from './relative-response';
import {RelativeAssembler} from './relative-assembler';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs';

const relativesEndpointUrl = `${environment.platformProviderFakeApiBaseUrl}${environment.platformProviderRelativesEndpointPath}`;
const nursingHomeRelativesEndpointUrl = `${environment.platformProviderFakeApiBaseUrl}${environment.platformProviderNursingHomeRelativesEndpointPath}`;
export class RelativesApiEndpoint extends BaseApiEndpoint<Relative, RelativeResource, RelativeResponse, RelativeAssembler>{

  constructor(http: HttpClient) {
    super(http, relativesEndpointUrl, new RelativeAssembler());
  }

  //get /api/v1/nursing-homes/{nursingHomeId}/relatives
  getRelativesByNursingHomeId(nursingHomeId: number){
    const url = nursingHomeRelativesEndpointUrl.replace('{nursingHomeId}', nursingHomeId.toString());
    return this.http.get<RelativeResource[]>(url).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch relatives for nursing home with id ${nursingHomeId}`))
    );
  }
}
