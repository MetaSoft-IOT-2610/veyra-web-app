import { computed, Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { CreateAdministratorCommand } from '../domain/model/create-administrator.command';

/**
 * Estado de sesión en memoria (`isSignedIn`, usuario, roles) + token en `localStorage` tras login.
 * Tras F5, `rehydrateSessionFromStorage()` restaura sesión si existen `token`, `username` y `userId`.
 *
 * MEJORA — Expiración / 401 (coordinar con `authenticationInterceptor`):
 * - Añadir `readonly sessionExpired = signal(false)` (o `overlayVisible`).
 * - Método `handleSessionExpired(router: Router)`: limpiar storage y señales como `signOut`,
 *   poner `sessionExpired.set(true)`, abrir `MatSnackBar`, `router.navigate(['/iam/sign-in'])`.
 * - En la plantilla global o `MainLayout`, `@if (store.sessionExpired()) { <div class="session-lock">…</div> }`
 *   con posición fixed, fondo semitransparente y `pointer-events: auto` para bloquear la interacción
 *   hasta que el usuario vaya a login (o `sessionExpired.set(false)` solo tras login exitoso).
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<Array<User>>([]);

  private readonly currentRolesSignal = signal<string[]>([]);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly loadingUsers = signal<boolean>(false);
  readonly currentUsername = this.currentUsernameSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentRoles = this.currentRolesSignal.asReadonly();
  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);
  readonly users = this.usersSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    this.rehydrateSessionFromStorage();
  }

  /** Restaura sesión en memoria si hay token guardado (p. ej. tras F5). */
  private rehydrateSessionFromStorage(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const rolesJson = localStorage.getItem('userRoles');
    if (!token || !username || !userId) {
      return;
    }
    let roles: string[] = [];
    if (rolesJson) {
      try {
        roles = JSON.parse(rolesJson) as string[];
      } catch {
        roles = [];
      }
    }
    this.isSignedInSignal.set(true);
    this.currentUsernameSignal.set(username);
    this.currentUserIdSignal.set(Number(userId));
    this.currentRolesSignal.set(Array.isArray(roles) ? roles : []);
  }

  createAdministrator(createAdministratorCommand: CreateAdministratorCommand, router: Router) {
    this.iamApi.createAdministrator(createAdministratorCommand).subscribe({
      next: (administratorResource) => {
        console.log('Administrator created successfully:', administratorResource);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Administrator creation failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        this.currentRolesSignal.set([]);
        router.navigate(['/iam/sign-up'], {
          queryParams: { role: 'admin' }
        }).then();
      }
    })
  }

  signIn(signInCommand: SignInCommand, router: Router) {
    console.log(signInCommand);
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        localStorage.setItem('userId', signInResource.id.toString());
        localStorage.setItem('username', signInResource.username);
        localStorage.setItem('userRoles', JSON.stringify(signInResource.roles ?? []));

        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(signInResource.username);
        this.currentUserIdSignal.set(signInResource.id);
        this.currentRolesSignal.set(signInResource.roles ?? []);

        if(signInResource.roles.includes("ROLE_ADMIN")) {
          router.navigate(['/nursing/nursing-homes/new']).then();
        } else {
          router.navigate(['/analytics/dashboard']).then();
        }
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        this.currentRolesSignal.set([]);
        router.navigate(['/iam/sign-in']).then();
      }
    });
  }

  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        this.currentRolesSignal.set([]);
        router.navigate(['/iam/sign-up']).then();
      }
    });
  }

  signOut(router: Router) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('nursingHomeId');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    router.navigate(['/home']).then();
  }
}
