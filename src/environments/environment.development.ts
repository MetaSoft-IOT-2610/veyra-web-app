export const environment = {
  production: false,
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',
  platformProviderFakeApiBaseUrl: 'http://localhost:3000/api/v1',

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

  // Healt Bounded Context
  platformProviderAllergiesEndpointPath: '/allergies',
  platformProviderVitalSignsEndpointPath: '/vital-signs',
  platformProviderHealthRecordsEndpointPath: '/health-records',
  platformProviderHealthAlertsEndpointPath: '/health-alerts',
  platformProviderHealtResidentAllergiesEndpointPath: '/residents/{residentId}/allergies',
  platformProviderHealtResidentVitalSignsEndpointPath: '/residents/{residentId}/vital-signs',

  // Profiles Bounded Context
  platformProviderBusinessProfilesEndpointPath: '/business-profiles',
  platformProviderPersonProfilesEndpointPath: '/person-profiles',

  // Activities Bounded Context
  platformProviderActivitiesEndpointPath: '/activities',

};
