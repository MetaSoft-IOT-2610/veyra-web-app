export const environment = {
  production: true,
  /** En producción suele mostrarse la sección IAM del toolbar cuando reactive el login real. */
  showIamToolbar: true,
  /** Nunca aplicar sesión simulada en producción. */
  fallbackDevUserSession: false,
  //platformProviderApiBaseUrl: 'https://myfake-api-production.up.railway.app',
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1', 
  platformProviderWsUrl: 'ws://localhost:8080/ws',
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
  platformProviderActivitiesEndpointPath: '/activities',

  // Alerts Bounded Context
  platformProviderAlertsEndpointPath: '/alerts',

  // Tracking Bounden Context
  platformProviderDeviceAssignmentsEndpointPath: '/devices/{deviceId}/assignments',
  platformProviderWsTrackingTopicPath: '/topic/tracking',
  platformProviderDevicesEndpointPath: '/devices',

  // Firebase Cloud Messaging
  platformProviderFcmTokenEndpointPath: '/users/{userId}/push-tokens',
  firebaseConfig: {
    apiKey: 'AIzaSyAh2nXjZIW5dWci5GH-ibsR7ysRxGas_Dg',
    authDomain: 'upc-pre-iot-metasoft.firebaseapp.com',
    projectId: 'upc-pre-iot-metasoft',
    storageBucket: 'upc-pre-iot-metasoft.firebasestorage.app',
    messagingSenderId: '565630535895',
    appId: '1:565630535895:web:3cfbc0720c5e0dc2438892',
    measurementId: 'G-M9JKZLCWNE',
  },
  firebaseVapidKey: 'BKAE2jj01JE9rStKocpNBTDzHx8p73aArkWTx2LraSe84Ie8ulaFeWN3atm5WkbVZXSRyKhoAfzeLrECK6_nbmA',

};

