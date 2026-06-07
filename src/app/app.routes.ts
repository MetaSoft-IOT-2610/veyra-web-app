import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { MainLayout } from './shared/presentation/views/main-layout/main-layout';

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const iamRoutes = () =>
  import('./iam/presentation/iam.routes').then(m => m.iamRoutes);
const analyticsRoutes = () =>
  import('./analytics/presentation/analytics-routes').then(m => m.analyticsRoutes);
const nursingRoutes = () =>
  import('./nursing/presentation/nursing-routes').then(m => m.nursingRoutes);
const hcmRoutes = () =>
  import('./hcm/presentation/hcm-routes').then(m => m.hcmRoutes);
const paymentsRoutes = () =>
  import('./payments/presentation/payments-routes').then(m => m.paymentsRoutes);
const activitiesRoutes = () =>
  import('./activities/presentation/activities-routes').then(m => m.activitiesRoutes);
const alertsRoutes = () =>
  import('./alerts/presentation/alerts-routes').then(m => m.alertsRoutes);
const trackingRoutes =()=>
  import('./tracking/presentation/tracking-routes').then(m=>m.trackingRoutes);
const chatRoutes = () =>
  import('./chat/presentation/chat.routes').then(m => m.chatRoutes);
const baseTitle = 'Veyra';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, title: `Home | ${baseTitle}` },
  { path: 'iam', loadChildren: iamRoutes },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'analytics', loadChildren: analyticsRoutes },
      { path: 'nursing', loadChildren: nursingRoutes },
      { path: 'hcm', loadChildren: hcmRoutes },
      { path: 'payments', loadChildren: paymentsRoutes },
      { path: 'activities', loadChildren: activitiesRoutes },
      { path: 'alerts', loadChildren: alertsRoutes },
      {path:'tracking',loadChildren:trackingRoutes},
      { path: 'chat', loadChildren: chatRoutes },
    ],
  },
  { path: '**', loadComponent: pageNotFound, title: `Page Not Found | ${baseTitle}` },
];
