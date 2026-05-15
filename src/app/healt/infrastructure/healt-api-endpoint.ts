import { environment } from '../../../environments/environment.development';

export class HealtApiEndpoint {
  public static readonly allergies =
    `${environment.platformProviderApiBaseUrl}${environment.platformProviderAllergiesEndpointPath}`;

  public static readonly vitalSigns =
    `${environment.platformProviderApiBaseUrl}${environment.platformProviderVitalSignsEndpointPath}`;

  public static readonly healthRecords =
    `${environment.platformProviderApiBaseUrl}${environment.platformProviderHealthRecordsEndpointPath}`;

  public static readonly healthAlerts =
    `${environment.platformProviderApiBaseUrl}${environment.platformProviderHealthAlertsEndpointPath}`;

  public static residentAllergies(residentId: number): string {
    const endpointPath = environment.platformProviderHealtResidentAllergiesEndpointPath
      .replace('{residentId}', residentId.toString());

    return `${environment.platformProviderApiBaseUrl}${endpointPath}`;
  }

  public static residentVitalSigns(residentId: number): string {
    const endpointPath = environment.platformProviderHealtResidentVitalSignsEndpointPath
      .replace('{residentId}', residentId.toString());

    return `${environment.platformProviderApiBaseUrl}${endpointPath}`;
  }
}
