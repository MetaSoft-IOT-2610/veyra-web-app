export const environment = {
  production: true,
  /** En producción suele mostrarse la sección IAM del toolbar cuando reactive el login real. */
  showIamToolbar: true,
  /** Nunca aplicar sesión simulada en producción. */
  fallbackDevUserSession: false,
  platformProviderApiBaseUrl: 'https://veyra-backend.whiteground-ce499065.canadacentral.azurecontainerapps.io/api/v1',
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
  platformProviderAdministratorsEndpointPath: '/administrators',

  // Nursing Bounded Context
  platformProviderResidentVitalSigsEndpointPath: '/resident/{residentId}/vital-signs',
  platformProviderNursingHomeDevicesEndpointPath: '/nursing-homes/{nursingHomeId}/devices',
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
  platformProviderActivitiesEndpointPath: '/nursing-homes/{nursingHomeId}/activities',
  platformProviderActivityEndpointPath: '/activities',

  // Alerts Bounded Context
  platformProviderAlertsEndpointPath: '/alerts',

  // Tracking Bounden Context
  platformProviderDeviceAssignmentsEndpointPath: '/devices/{deviceId}/assignments',
  platformProviderDevicesEndpointPath: '/devices',
  platformProviderDeviceStatusEndpointPath: '/devices/{deviceId}/status',
  platformProviderDeviceByIdEndpointPath: '/devices/{deviceId}',

};

