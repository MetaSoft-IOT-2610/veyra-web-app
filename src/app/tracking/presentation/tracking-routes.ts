import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

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
      ...routePageKeys('tracking.devices.list'),
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
      ...routePageKeys('tracking.devices.assign'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: trackingPaths.deviceDetail,
    name: 'tracking.devices.detail',
    loadComponent: deviceDetail,
    page: {
      ...routePageKeys('tracking.devices.detail'),
      showBackButton: true,
    },
  }),
];

export { trackingRoutes };
