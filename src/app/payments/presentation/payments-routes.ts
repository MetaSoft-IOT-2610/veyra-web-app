import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';

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
      title: 'Elegir suscripción',
      module: 'Pagos',
      description: 'Selecciona el tipo de plan para continuar',
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: paymentsPaths.planFamily,
    name: 'payments.plan.family',
    loadComponent: subscriptionPlanFamily,
    page: {
      title: 'Plan familia',
      module: 'Pagos',
      description: 'Opciones de suscripción para familias',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: paymentsPaths.planNursingHome,
    name: 'payments.plan.nursing-home',
    loadComponent: subscriptionPlanNursing,
    page: {
      title: 'Plan residencia',
      module: 'Pagos',
      description: 'Opciones de suscripción para residencias',
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: paymentsPaths.checkout,
    name: 'payments.checkout',
    loadComponent: paymentCheckout,
    page: {
      title: 'Pago',
      module: 'Pagos',
      description: 'Completa el proceso de suscripción',
      showBackButton: true,
    },
  }),
];
