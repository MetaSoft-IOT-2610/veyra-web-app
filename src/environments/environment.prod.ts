// ============================================================
// PRODUCTION environment — used by: ng build (default config)
// IMPORTANT: replace REPLACE_WITH_YOUR_PRODUCTION_API_URL with
// the actual base URL of your deployed backend API.
// Example: 'https://api.veyra.com/api/v1'
// ============================================================
export const environment = {
  production: true,
  showIamToolbar: true,
  fallbackDevUserSession: false,
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',

  // Analytics Bounded Context
  platformProviderAnalyticsStaffTerminationsEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/staff-terminations',
  platformProviderAnalyticsStaffHiresEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/staff-hires',
  platformProviderAnalyticsResidentsAdmissionsEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/residents-admissions',

  // Hcm Bounded Context
  platformProviderContractsEndpointPath: '/contracts',
  platformProviderStaffEndpointPath: '/staff',
  platformProviderStaffMemberContractsEndpointPath: '/staff/{staffMemberId}/contracts',
  platformProviderStaffMemberContractStatusEndpointPath: '/staff/{staffMemberId}/contracts/{contractId}',

  // IAM Bounded Context
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  platformProviderAdministratorsEndpointPath: '/administrators',

  // Nursing Bounded Context
  platformProviderResidentVitalSigsEndpointPath: '/resident/{residentId}/vital-signs',
  platformProviderDevicesEndpointPath: '/devices',
  platformProviderResidentAllergiesEndpointPath: '/residents/{residentId}/allergies',
  platformProviderAdministratorNursingHomesEndpointPath: '/administrators/{administratorId}/nursing-homes',
  platformProviderResidentRoomsEndpointPath: '/nursing-homes/{nursingHomeId}/rooms/{residentId}',
  platformProviderResidentMedicationsEndpointPath: '/residents/{residentId}/medications',
  platformProviderNursingHomeResidentsEndpointPath: '/nursing-homes/{nursingHomeId}/residents',
  platformProviderNursingHomeStaffEndpointPath: '/nursing-homes/{nursingHomeId}/staff',
  platformProviderNursingHomeRoomsEndpointPath: '/nursing-homes/{nursingHomeId}/rooms',
  platformProviderMedicationsEndpointPath: '/medications',
  platformProviderNursingHomesEndpointPath: '/nursing-homes',
  platformProviderResidentsEndpointPath: '/residents',
  platformProviderRoomsEndpointPath: '/rooms',
  platformProviderRelativesEndpointPath: '/relatives',
  platformProviderNursingHomeRelativesEndpointPath: '/nursing-homes/{nursingHomeId}/relatives',

  platformProviderMonitoringResidentsEndpointPath: '/nursing-homes/{nursingHomeId}/doctors/{doctorId}/monitoring-residents',
  // Profiles Bounded Context
  platformProviderBusinessProfilesEndpointPath: '/business-profiles',
  platformProviderPersonProfilesEndpointPath: '/person-profiles',

  // Activities Bounded Context
  platformProviderActivitiesEndpointPath: '/activities',

  // Alerts Bounded Context
  platformProviderAlertsEndpointPath: '/alerts',
};
