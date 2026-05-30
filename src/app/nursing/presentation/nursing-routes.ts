import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

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
  allergyNew: 'residents/:id/allergies/new',
  rooms: 'rooms',
  roomNew: 'rooms/new',
  roomEdit: 'rooms/:id/edit',
  medications: 'residents/:id/medications',
  medicationNew: 'residents/:id/medications/new',
  devices: 'devices',
  relatives: 'relatives',
  relativeNew: 'relatives/new',
  myPatients: 'my-patients',
} as const;

export const nursingNav = {
  nursingHomeNew: () => ['/nursing', nursingPaths.nursingHomeNew],
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
      title: 'Nueva residencia',
      module: 'Enfermería',
      description: 'Registro inicial de la residencia',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.residents,
    name: 'nursing.residents.list',
    loadComponent: residentList,
    page: {
      title: 'Residentes',
      module: 'Enfermería',
      description: 'Listado y gestión de residentes',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentDetail,
    name: 'nursing.residents.detail',
    loadComponent: residentDetail,
    page: {
      title: 'Detalle del residente',
      module: 'Enfermería',
      description: 'Información general del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentNew,
    name: 'nursing.residents.new',
    loadComponent: residentForm,
    page: {
      title: 'Nuevo residente',
      module: 'Enfermería',
      description: 'Registrar un nuevo residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.residentEdit,
    name: 'nursing.residents.edit',
    loadComponent: residentForm,
    page: {
      title: 'Editar residente',
      module: 'Enfermería',
      description: 'Actualizar datos del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.assignRoom,
    name: 'nursing.residents.assign-room',
    loadComponent: assignRoomForm,
    page: {
      title: 'Asignar habitación',
      module: 'Enfermería',
      description: 'Asigna una habitación al residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicalRecords,
    name: 'nursing.residents.medical-records',
    loadComponent: residentMedicalRecord,
    page: {
      title: 'Registros médicos',
      module: 'Enfermería',
      description: 'Historial clínico del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.allergyNew,
    name: 'nursing.residents.allergy-new',
    loadComponent: allergyForm,
    page: {
      title: 'Nueva alergia',
      module: 'Enfermería',
      description: 'Registrar una alergia del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.rooms,
    name: 'nursing.rooms.list',
    loadComponent: roomList,
    page: {
      title: 'Habitaciones',
      module: 'Enfermería',
      description: 'Gestión de habitaciones de la residencia',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.roomNew,
    name: 'nursing.rooms.new',
    loadComponent: roomForm,
    page: {
      title: 'Nueva habitación',
      module: 'Enfermería',
      description: 'Registrar una nueva habitación',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.roomEdit,
    name: 'nursing.rooms.edit',
    loadComponent: roomForm,
    page: {
      title: 'Editar habitación',
      module: 'Enfermería',
      description: 'Actualizar datos de la habitación',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medications,
    name: 'nursing.residents.medications',
    loadComponent: medicationList,
    page: {
      title: 'Medicación',
      module: 'Enfermería',
      description: 'Medicamentos del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.medicationNew,
    name: 'nursing.residents.medication-new',
    loadComponent: medicationForm,
    page: {
      title: 'Nueva medicación',
      module: 'Enfermería',
      description: 'Registrar un medicamento',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.devices,
    name: 'nursing.devices.list',
    loadComponent: deviceList,
    page: {
      title: 'Dispositivos',
      module: 'Enfermería',
      description: 'Dispositivos asignados en la residencia',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.relatives,
    name: 'nursing.relatives.list',
    loadComponent: relativeList,
    page: {
      title: 'Familiares',
      module: 'Enfermería',
      description: 'Contactos familiares vinculados',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: nursingPaths.relativeNew,
    name: 'nursing.relatives.new',
    loadComponent: relativeForm,
    page: {
      title: 'Nuevo familiar',
      module: 'Enfermería',
      description: 'Registrar un familiar del residente',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: nursingPaths.myPatients,
    name: 'nursing.my-patients',
    loadComponent: residentMonitoring,
    page: {
      title: 'Mis pacientes',
      module: 'Enfermería',
      description: 'Monitoreo de residentes asignados',
      showBackButton: false,
    },
  }),
];

export { nursingRoutes };
