import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

/**
 * Response shape returned by GET /api/v1/staff/{staffId}/nursing-homes
 */
export interface StaffNursingHomeResource {
  businessProfileId: number;
  staffId: number;
}

const staffNursingHomesEndpointUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderStaffNursingHomesEndpointPath}`;

/**
 * API endpoint for resolving the nursing home that a staff member belongs to.
 * Calls GET /api/v1/staff/{staffId}/nursing-homes
 */
export class StaffNursingHomeApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Returns the businessProfileId (nursingHomeId) and staffId for the given user.
   * @param userId - The authenticated user ID (userId from localStorage).
   */
  getNursingHomeByUserId(userId: number): Observable<StaffNursingHomeResource> {
    const url = staffNursingHomesEndpointUrl.replace('{userId}', userId.toString());
    return this.http.get<StaffNursingHomeResource>(url).pipe(
      catchError(this.handleError(`Failed to fetch nursing home for user ${userId}`))
    );
  }
}
