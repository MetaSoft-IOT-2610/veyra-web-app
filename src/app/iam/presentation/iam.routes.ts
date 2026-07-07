import { Routes } from '@angular/router';
import { definePageRoute } from '../../shared/routing/define-page-route';
import { routePageKeys } from '../../shared/routing/route-page-data';

const signInForm = () =>
  import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const signUpForm = () =>
  import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
const setPasswordForm = () =>
  import('./views/set-password-form/set-password-form').then((m) => m.SetPasswordForm);

export const iamPaths = {
  signIn: 'sign-in',
  signUp: 'sign-up',
  setPassword: 'set-password',
} as const;

export const iamNav = {
  signIn: () => ['/iam', iamPaths.signIn],
  signUp: () => ['/iam', iamPaths.signUp],
  setPassword: () => ['/iam', iamPaths.setPassword],
} as const;

const iamRoutes: Routes = [
  definePageRoute({
    path: iamPaths.signIn,
    name: 'iam.sign-in',
    loadComponent: signInForm,
    page: {
      ...routePageKeys('iam.sign-in'),
      showBackButton: false,
    },
  }),
  definePageRoute({
    path: iamPaths.signUp,
    name: 'iam.sign-up',
    loadComponent: signUpForm,
    page: {
      ...routePageKeys('iam.sign-up'),
      showBackButton: true,
    },
  }),
  definePageRoute({
    path: iamPaths.setPassword,
    name: 'iam.set-password',
    loadComponent: setPasswordForm,
    page: {
      ...routePageKeys('iam.set-password'),
      showBackButton: false,
    },
  }),
];

export { iamRoutes };
