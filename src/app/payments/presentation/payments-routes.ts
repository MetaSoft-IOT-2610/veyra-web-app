import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

const subscriptionChoose = () =>
  import('./views/subscription-choose/subscription-choose').then((m) => m.SubscriptionChoosePage);

const subscriptionPlanNursing = () =>
  import('./views/subscription-plan-nursing/subscription-plan-nursing').then(
    (m) => m.SubscriptionPlanNursing
  );

const subscriptionPlanFamily = () =>
  import('./views/subscription-plan-family/subscription-plan-family').then(
    (m) => m.SubscriptionPlanFamily
  );

const paymentCheckout = () =>
  import('./components/payment-checkout/payment-checkout').then((m) => m.PaymentCheckoutPage);

export const paymentsPaths = {
  choose: 'choose',
  planFamily: 'plans/family',
  planNursingHome: 'plans/nursing-home',
  checkout: 'checkout/:type/:cycle',
} as const;

export const paymentsNav = {
  choose: () => ['/payments', paymentsPaths.choose],
  planFamily: () => ['/payments', paymentsPaths.planFamily],
  planNursingHome: () => ['/payments', paymentsPaths.planNursingHome],
  checkout: (type: string, cycle: string) => ['/payments', 'checkout', type, cycle],
} as const;

export const paymentsRoutes: Routes = [
  definePageRoute({
    path: paymentsPaths.choose,
    name: 'payments.choose',
    loadComponent: subscriptionChoose,
    page: {
      ...routePageKeys('payments.choose'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: paymentsPaths.planFamily,
    name: 'payments.plan.family',
    loadComponent: subscriptionPlanFamily,
    page: {
      ...routePageKeys('payments.plan.family'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: paymentsPaths.planNursingHome,
    name: 'payments.plan.nursing-home',
    loadComponent: subscriptionPlanNursing,
    page: {
      ...routePageKeys('payments.plan.nursing-home'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: paymentsPaths.checkout,
    name: 'payments.checkout',
    loadComponent: paymentCheckout,
    page: {
      ...routePageKeys('payments.checkout'),
      showBackButton: true,
    },
  }),
];
