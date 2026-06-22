import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const deviceList = () =>
  import('./views/device-list/device-list').then(m => m.DeviceList);
const assignDeviceForm = () =>
 import('./components/assign-device-form/assign-device-form').then(m => m.AssignDeviceForm);
const deviceDetail = () =>
  import('./views/device-detail/device-detail').then(m => m.DeviceDetail);

export const trackingPaths = {
  devices: 'devices',
  deviceAssign: 'devices/:id/assign',
  deviceDetail: 'devices/:id/detail',
} as const;

export const trackingNav = {
  devices: () => ['/tracking', trackingPaths.devices],
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
  {
    path: 'devices/new',
    redirectTo: 'devices',
    pathMatch: 'full',
  },
  {
    path: 'devices/:id/edit',
    redirectTo: 'devices',
    pathMatch: 'full',
  },
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
  definePageRoute({
    path: trackingPaths.deviceDetail,
    name: 'tracking.devices.detail',
    loadComponent: deviceDetail,
    page: {
      title: 'Detalle del dispositivo',
      module: 'Detalle del dispositivo',
      description: 'Cargando dispositivo…',
      showBackButton: true,
    },
  }),
];

export { trackingRoutes };
