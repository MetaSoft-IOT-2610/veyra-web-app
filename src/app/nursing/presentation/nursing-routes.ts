import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

const residentForm = () =>
  import('./views/resident-form/resident-form').then((m) => m.ResidentForm);
const residentList = () =>
  import('./views/resident-list/resident-list').then((m) => m.ResidentList);
const residentDetail = () =>
  import('./views/resident-detail/resident-detail').then((m) => m.ResidentDetail);
const residentMedicalRecord = () =>
  import('./views/medical-record-list/medical-record-list').then((m) => m.MedicalRecordList);
const allergyForm = () =>
  import('./views/allergy-form/allergy-form').then((m) => m.AllergyForm);
const roomList = () => import('./views/room-list/room-list').then((m) => m.RoomList);
const roomForm = () => import('./views/room-form/room-form').then((m) => m.RoomForm);
const nursingHomeForm = () =>
  import('./views/nursing-home-form/nursing-home-form').then((m) => m.NursingHomeForm);
const medicationList = () =>
  import('./views/medication-list/medication-list').then((m) => m.MedicationList);
const medicationForm = () =>
  import('./views/medication-form/medication-form').then((m) => m.MedicationForm);
const medicalConditionList = () =>
  import('./views/medical-condition-list/medical-condition-list').then((m) => m.MedicalConditionList);
const medicalConditionForm = () =>
  import('./views/medical-condition-form/medical-condition-form').then((m) => m.MedicalConditionForm);
const vitalSignThresholdForm = () =>
  import('./views/vital-sign-threshold-form/vital-sign-threshold-form').then((m) => m.VitalSignThresholdForm);
const assignRoomForm = () =>
  import('./views/assign-room-form/assign-room-form').then((m) => m.AssignRoomForm);
const deviceList = () => import('./views/device-list/device-list').then((m) => m.DeviceList);
const relativeList = () =>
  import('./views/relative-list/relative-list').then((m) => m.RelativeList);
const relativeForm = () =>
  import('./views/relative-form/relative-form').then((m) => m.RelativeForm);
const residentMonitoring = () =>
  import('./views/resident-monitoring-page/resident-monitoring-page').then(
    (m) => m.ResidentMonitoringPage
  );

export const nursingPaths = {
  nursingHomeNew: 'nursing-homes/new',
  residents: 'residents',
  residentDetail: 'residents/:id/show',
  residentNew: 'residents/new',
  residentEdit: 'residents/:id/edit',
  assignRoom: 'residents/:id/room-assignments/new',
  medicalRecords: 'residents/:id/medical-records',
  vitalSignThresholds: 'residents/:id/vital-sign-thresholds',
  allergyNew: 'residents/:id/allergies/new',
  rooms: 'rooms',
  roomNew: 'rooms/new',
  roomEdit: 'rooms/:id/edit',
  medications: 'residents/:id/medications',
  medicationNew: 'residents/:id/medications/new',
  medicalConditions: 'residents/:id/medical-conditions',
  medicalConditionNew: 'residents/:id/medical-conditions/new',
  devices: 'devices',
  relatives: 'relatives',
  relativeNew: 'relatives/new',
  myPatients: 'my-patients',
} as const;

export const nursingNav = {
  nursingHomeNew: () => ['/nursing', 'nursing-homes', 'new'],
  residents: () => ['/nursing', nursingPaths.residents],
  residentNew: () => ['/nursing', nursingPaths.residents, 'new'],
  residentDetail: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'show'],
  residentEdit: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'edit'],
  assignRoom: (id: number | string) => [
    '/nursing',
    nursingPaths.residents,
    id,
    'room-assignments',
    'new',
  ],
  medicalRecords: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'medical-records'],
  vitalSignThresholds: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'vital-sign-thresholds'],
  allergyNew: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'allergies', 'new'],
  rooms: () => ['/nursing', nursingPaths.rooms],
  roomNew: () => ['/nursing', nursingPaths.rooms, 'new'],
  roomEdit: (id: number | string) => ['/nursing', nursingPaths.rooms, id, 'edit'],
  medications: (id: number | string) => ['/nursing', nursingPaths.residents, id, 'medications'],
  medicationNew: (id: number | string) => [
    '/nursing',
    nursingPaths.residents,
    id,
    'medications',
    'new',
  ],
  medicalConditions: (id: number | string) => [
    '/nursing',
    nursingPaths.residents,
    id,
    'medical-conditions',
  ],
  medicalConditionNew: (id: number | string) => [
    '/nursing',
    nursingPaths.residents,
    id,
    'medical-conditions',
    'new',
  ],
  devices: () => ['/nursing', nursingPaths.devices],
  relatives: () => ['/nursing', nursingPaths.relatives],
  relativeNew: () => ['/nursing', nursingPaths.relatives, 'new'],
  myPatients: () => ['/nursing', nursingPaths.myPatients],
} as const;

const nursingRoutes: Routes = [
  definePageRoute({
    path: nursingPaths.nursingHomeNew,
    name: 'nursing.nursing-home.new',
    loadComponent: nursingHomeForm,
    page: {
      ...routePageKeys('nursing.nursing-home.new'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.residents,
    name: 'nursing.residents.list',
    loadComponent: residentList,
    page: {
      ...routePageKeys('nursing.residents.list'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentDetail,
    name: 'nursing.residents.detail',
    loadComponent: residentDetail,
    page: {
      ...routePageKeys('nursing.residents.detail'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentNew,
    name: 'nursing.residents.new',
    loadComponent: residentForm,
    page: {
      ...routePageKeys('nursing.residents.new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentEdit,
    name: 'nursing.residents.edit',
    loadComponent: residentForm,
    page: {
      ...routePageKeys('nursing.residents.edit'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.assignRoom,
    name: 'nursing.residents.assign-room',
    loadComponent: assignRoomForm,
    page: {
      ...routePageKeys('nursing.residents.assign-room'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicalRecords,
    name: 'nursing.residents.medical-records',
    loadComponent: residentMedicalRecord,
    page: {
      ...routePageKeys('nursing.residents.medical-records'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.vitalSignThresholds,
    name: 'nursing.residents.vital-sign-thresholds',
    loadComponent: vitalSignThresholdForm,
    page: {
      ...routePageKeys('nursing.residents.vital-sign-thresholds'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.allergyNew,
    name: 'nursing.residents.allergy-new',
    loadComponent: allergyForm,
    page: {
      ...routePageKeys('nursing.residents.allergy-new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.rooms,
    name: 'nursing.rooms.list',
    loadComponent: roomList,
    page: {
      ...routePageKeys('nursing.rooms.list'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.roomNew,
    name: 'nursing.rooms.new',
    loadComponent: roomForm,
    page: {
      ...routePageKeys('nursing.rooms.new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.roomEdit,
    name: 'nursing.rooms.edit',
    loadComponent: roomForm,
    page: {
      ...routePageKeys('nursing.rooms.edit'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medications,
    name: 'nursing.residents.medications',
    loadComponent: medicationList,
    page: {
      ...routePageKeys('nursing.residents.medications'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicationNew,
    name: 'nursing.residents.medication-new',
    loadComponent: medicationForm,
    page: {
      ...routePageKeys('nursing.residents.medication-new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicalConditions,
    name: 'nursing.residents.medical-conditions',
    loadComponent: medicalConditionList,
    page: {
      ...routePageKeys('nursing.residents.medical-conditions'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicalConditionNew,
    name: 'nursing.residents.medical-condition-new',
    loadComponent: medicalConditionForm,
    page: {
      ...routePageKeys('nursing.residents.medical-condition-new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.devices,
    name: 'nursing.devices.list',
    loadComponent: deviceList,
    page: {
      ...routePageKeys('nursing.devices.list'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.relatives,
    name: 'nursing.relatives.list',
    loadComponent: relativeList,
    page: {
      ...routePageKeys('nursing.relatives.list'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.relativeNew,
    name: 'nursing.relatives.new',
    loadComponent: relativeForm,
    page: {
      ...routePageKeys('nursing.relatives.new'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.myPatients,
    name: 'nursing.my-patients',
    loadComponent: residentMonitoring,
    page: {
      ...routePageKeys('nursing.my-patients'),
      showBackButton: false,
    },
  }),
];

export { nursingRoutes };
