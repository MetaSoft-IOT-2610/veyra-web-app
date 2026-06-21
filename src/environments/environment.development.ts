export const environment = {
  production: false,
  /** Si es false, el `MainLayout` no muestra botones SIGN-IN / registro en toolbar; con sesión activa sí se muestra el menú de cuenta. */
  showIamToolbar: true,
  /**
   * Si no hay sesión válida en `localStorage`, aplica usuario de desarrollo **solo al entrar al layout
   * con sidebar** (`MainLayout`), no en `/home` ni otras rutas públicas.
   */
  fallbackDevUserSession: false,

  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',
  platformProviderWsUrl: 'ws://localhost:8080/ws',
  // Analytics Bounded Context
  platformProviderAnalyticsStaffTerminationsEndpointPath: '/nursing-homes/{nursingHomeId}/staff-terminations',
  platformProviderAnalyticsStaffHiresEndpointPath: '/nursing-homes/{nursingHomeId}/staff-hires',
  platformProviderAnalyticsResidentsAdmissionsEndpointPath: '/nursing-homes/{nursingHomeId}/residents-admissions',

  // Hcm Bounded Context
  platformProviderContractsEndpointPath: '/contracts',
  platformProviderStaffEndpointPath:'/staff',
  platformProviderStaffMemberContractsEndpointPath:'/staff/{staffMemberId}/contracts',
  platformProviderStaffMemberContractStatusEndpointPath:'/staff/{staffMemberId}/contracts/{contractId}',
  platformProviderStaffNursingHomesEndpointPath: '/staff/by-user/{userId}/nursing-homes',

  //IAM Bounded Context
  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  platformProviderSetPasswordEndpointPath:'/authentication/set-password',
  platformProviderAdministratorsEndpointPath: '/administrators',

  // Nursing Bounded Context
  platformProviderResidentVitalSigsEndpointPath: '/resident/{residentId}/vital-signs',
  platformProviderNursingHomeDevicesEndpointPath: '/nursing-homes/{nursingHomeId}/devices',
  platformProviderResidentAllergiesEndpointPath: '/residents/{residentId}/allergies',
  platformProviderAdministratorNursingHomesEndpointPath: '/administrators/{administratorId}/nursing-homes',
  platformProviderResidentRoomsEndpointPath: '/nursing-homes/{nursingHomeId}/rooms/{residentId}',
  platformProviderResidentMedicationsEndpointPath: '/residents/{residentId}/medications',
  platformProviderResidentMedicalConditionsEndpointPath: '/residents/{residentId}/medical-conditions',
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

  // Health Bounded Context
  platformProviderAllergiesEndpointPath: '/allergies',
  platformProviderHealthRecordsEndpointPath: '/health-records',
  platformProviderHealthAlertsEndpointPath: '/health-alerts',
  platformProviderHealthResidentAllergiesEndpointPath: '/residents/{residentId}/allergies',
  platformProviderHealthResidentVitalSignThresholdsEndpointPath: '/residents/{residentId}/vital-sign-thresholds',

  // Profiles Bounded Context
  platformProviderBusinessProfilesEndpointPath: '/business-profiles',
  platformProviderPersonProfilesEndpointPath: '/person-profiles',

  // Activities Bounded Context
  platformProviderActivitiesEndpointPath: '/nursing-homes/{nursingHomeId}/activities',
  platformProviderActivityEndpointPath: '/activities',

  // Alerts Bounded Context
  platformProviderAlertsEndpointPath: '/alerts',

  //Tracking Bounden Context
  platformProviderDeviceAssignmentsEndpointPath: '/devices/{deviceId}/assignments',
  platformProviderDeviceStatusEndpointPath: '/devices/{deviceId}/status',
  platformProviderDevicesEndpointPath: '/devices',
  platformProviderDeviceByIdEndpointPath: '/devices/{deviceId}',
  platformProviderWsTrackingTopicPath: '/topic/tracking',




};
