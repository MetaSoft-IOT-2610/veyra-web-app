import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

const deviceList = () =>
  import('./views/device-list/device-list').then(m => m.DeviceList);
const deviceForm = () =>
  import('./views/device-form/device-form').then(m => m.DeviceForm);

export const trackingPaths = {
  devices: 'devices',
  deviceNew: 'devices/new',
  deviceAssign: 'devices/:id/assign',
} as const;

export const trackingNav = {
  devices: () => ['/tracking', trackingPaths.devices],
  deviceNew: () => ['/tracking', 'devices', 'new'],
  deviceAssign: (id: number | string) => ['/tracking', 'devices', id, 'assign'],
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
    path: trackingPaths.deviceAssign,
    name: 'tracking.devices.assign',
    loadComponent: deviceForm,
    page: {
      title: 'Asignar dispositivo',
      module: 'Tracking',
      description: 'Asignar dispositivo a un residente',
      showBackButton: true,
    },
  }),
];

export { trackingRoutes };
