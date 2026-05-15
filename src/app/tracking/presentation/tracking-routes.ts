import { Routes } from '@angular/router';

const deviceList = () =>
  import('./views/device-list/device-list').then(m => m.DeviceList);

const baseTitle = 'Veyra';
const trackingRoutes: Routes = [
  { path: 'devices', loadComponent: deviceList, title: `Devices | ${baseTitle}` }
];

export { trackingRoutes };
