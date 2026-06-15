import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const deviceList = () =>
  import('./views/device-list/device-list').then(m => m.DeviceList);
const deviceForm = () =>
  import('./views/device-form/device-form').then(m => m.DeviceForm);
const assignDeviceForm = () =>
 import('./components/assign-device-form/assign-device-form').then(m => m.AssignDeviceForm);
const deviceDetail = () =>                                                          // ← nuevo
  import('./views/device-detail/device-detail').then(m => m.DeviceDetail);
export const trackingPaths = {
  devices: 'devices',
  deviceNew: 'devices/new',
  deviceEdit: 'devices/:id/edit',
  deviceAssign: 'devices/:id/assign',
  deviceDetail: 'devices/:id/detail',
} as const;

export const trackingNav = {
  devices: () => ['/tracking', trackingPaths.devices],
  deviceNew: () => ['/tracking', 'devices', 'new'],
  deviceEdit: (id: number | string) => ['/tracking', 'devices', id, 'edit'],
  deviceAssign: (id: number | string) => ['/tracking', 'devices', id, 'assign'],
  deviceDetail: (id: number | string) => ['/tracking', 'devices', id, 'detail'],
} as const;

const trackingRoutes: Routes = [
  definePageRoute({
    path: trackingPaths.devices,
    name: 'tracking.devices.list',
    loadComponent: deviceList,
    page: {
      title: 'Dispositivos',
      module: 'Tracking',
      description: 'Listado y gestión de dispositivos',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: trackingPaths.deviceNew,
    name: 'tracking.devices.new',
    loadComponent: deviceForm,
    page: {
      title: 'Nuevo dispositivo',
      module: 'Tracking',
      description: 'Registrar un nuevo dispositivo',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: trackingPaths.deviceEdit,
    name: 'tracking.devices.edit',
    loadComponent: deviceForm,
    page: {
      title: 'Editar dispositivo',
      module: 'Tracking',
      description: 'Editar datos del dispositivo',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: trackingPaths.deviceAssign,
    name: 'tracking.devices.assign',
    loadComponent: assignDeviceForm,
    page: {
      title: 'Asignar dispositivo',
      module: 'Tracking',
      description: 'Asignar dispositivo a un residente',
      showBackButton: true,
    },
  }),
  definePageRoute({                        // ← nuevo
    path: trackingPaths.deviceDetail,
    name: 'tracking.devices.detail',
    loadComponent: deviceDetail,
    page: {
      title: 'Detalle del dispositivo',
      module: 'Tracking',
      description: 'Ver información del dispositivo',
      showBackButton: true,
    },
  }),
];

export { trackingRoutes };
