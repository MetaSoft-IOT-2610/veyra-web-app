export const environment = {
  production: false,
  /** Si es false, el `MainLayout` no muestra botones SIGN-IN / registro en toolbar; con sesión activa sí se muestra el menú de cuenta. */
  showIamToolbar: false,
  /**
   * Si no hay sesión válida en `localStorage`, aplica usuario de desarrollo **solo al entrar al layout
   * con sidebar** (`MainLayout`), no en `/home` ni otras rutas públicas.
   */
  fallbackDevUserSession: true,

  platformProviderApiBaseUrl: 'https://myfake-api-production.up.railway.app',
  platformProviderFakeApiBaseUrl: 'https://myfake-api-production.up.railway.app',

  // Analytics Bounded Context
  platformProviderAnalyticsStaffTerminationsEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/staff-terminations',
  platformProviderAnalyticsStaffHiresEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/staff-hires',
  platformProviderAnalyticsResidentsAdmissionsEndpointPath: '/nursing-homes/{nursingHomeId}/analytics/residents-admissions',

  // Hcm Bounded Context
  platformProviderContractsEndpointPath: '/contracts',
  platformProviderStaffEndpointPath:'/staff',
  platformProviderStaffMemberContractsEndpointPath:'/staff/{staffMemberId}/contracts',
  platformProviderStaffMemberContractStatusEndpointPath:'/staff/{staffMemberId}/contracts/{contractId}',

  //IAM Bounded Context
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
  platformProviderResidentRelativesEndpointPath: '/residents/{residentId}/relatives',
  platformProviderNursingHomeRelativesEndpointPath: '/nursing-homes/{nursingHomeId}/relatives',
  platformProviderMedicationsEndpointPath:'/medications',
  platformProviderNursingHomesEndpointPath:'/nursing-homes',
  platformProviderResidentsEndpointPath:'/residents',
  platformProviderRoomsEndpointPath: '/rooms',
  platformProviderRelativesEndpointPath: '/relatives',
  platformProviderMonitoringResidentsEndpointPath: '/nursing-homes/{nursingHomeId}/doctors/{doctorId}/monitoring-residents',

  // Profiles Bounded Context
  platformProviderBusinessProfilesEndpointPath: '/business-profiles',
  platformProviderPersonProfilesEndpointPath: '/person-profiles',

  // Activities Bounded Context
  platformProviderActivitiesEndpointPath: '/activities',

  // Alerts Bounded Context
  platformProviderAlertsEndpointPath: '/alerts',
};
