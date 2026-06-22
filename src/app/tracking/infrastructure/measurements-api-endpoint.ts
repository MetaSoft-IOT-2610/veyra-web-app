import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { Measurement } from '../domain/model/measurement.entity';
import { MeasurementAssembler } from './measurement-assembler';
import { MeasurementResource } from './measurements-response';

const measurementsEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderDeviceMeasurementsEndpointPath}`;

function measurementsUrl(deviceId: number): string {
  return measurementsEndpointUrl.replace('{deviceId}', deviceId.toString());
}

export class MeasurementsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new MeasurementAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getDeviceMeasurements(deviceId: number, limit = 50): Observable<Measurement[]> {
    return this.http
      .get<MeasurementResource[]>(measurementsUrl(deviceId), { params: { limit } })
      .pipe(
        map(response => this.assembler.toEntitiesFromResources(response)),
        catchError(this.handleError(`Failed to fetch measurements for device ${deviceId}`))
      );
  }
}
