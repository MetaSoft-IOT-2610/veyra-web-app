import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { MonitoringResidents } from '../domain/model/monitoring-residents.entity';
import { MonitoringResidentsResponse } from './monitoring-residents-response';
import { MonitoringResidentsAssembler } from './monitoring-residents-assembler';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

const monitoringResidentsEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderMonitoringResidentsEndpointPath}`;

export class MonitoringResidentsApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new MonitoringResidentsAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getByDoctorId(nursingHomeId: number, doctorId: number): Observable<MonitoringResidents[]> {
    const url = monitoringResidentsEndpointUrl
      .replace('{nursingHomeId}', nursingHomeId.toString())
      .replace('{doctorId}', doctorId.toString());

    return this.http.get<MonitoringResidentsResponse>(url).pipe(
      map(response => response.monitoringResidents.map(
        resource => this.assembler.toEntityFromResource(resource)
      )),
      catchError(this.handleError('Failed to load monitoring residents'))
    );
  }
}
