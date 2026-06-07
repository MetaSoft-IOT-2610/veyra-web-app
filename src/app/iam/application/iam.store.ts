import { computed, Injectable, signal } from '@angular/core';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { Router } from '@angular/router';
import { IamApi } from '../infrastructure/iam-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { CreateAdministratorCommand } from '../domain/model/create-administrator.command';
import { environment } from '../../../environments/environment';
import { appNav } from '../../shared/routing/app-nav';
import { analyticsNav } from '../../analytics/presentation/analytics-routes';
import { iamNav } from '../presentation/iam.routes';
import { nursingNav } from '../../nursing/presentation/nursing-routes';
import { FirebaseMessagingService } from '../../shared/infrastructure/firebase-messaging.service';

/**
 * Estado de sesion en memoria (isSignedIn, usuario, roles) + token en localStorage tras login.
 * Tras F5, rehydrateSessionFromStorage() restaura sesion si existen token, username y userId.
 *
 * FCM - Firebase Cloud Messaging:
 * - initFcmForCurrentUser(): inicializa FCM, obtiene el token y lo registra en el backend.
 *   Llamar tras sign-in (automatico) y al montar MainLayout para sesiones rehidratadas.
 * - cleanupFcm(): revoca el token de Firebase y lo elimina del backend. Llamar en sign-out.
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

  constructor(private iamApi: IamApi, private readonly fcmService: FirebaseMessagingService) {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    this.rehydrateSessionFromStorage();
  }

  tryApplyDevFallbackSession(): void {
    if (environment.fallbackDevUserSession && !this.isSignedInSignal()) {
      this.applyDefaultDevUserSession();
    }
  }

  private applyDefaultDevUserSession(): void {
    const username = 'Usuario';
    const userId = '1';
    const roles = ['ROLE_USER'] as string[];
    localStorage.setItem('token', 'dev');
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    this.isSignedInSignal.set(true);
    this.currentUsernameSignal.set(username);
    this.currentUserIdSignal.set(Number(userId));
    this.currentRolesSignal.set(roles);
  }

  rehydrateSessionFromStorage(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const rolesJson = localStorage.getItem('userRoles');

    console.debug('[IamStore] rehydrateSessionFromStorage -> token:', token, 'username:', username, 'userId:', userId, 'roles:', rolesJson);

    if (!token || token === 'null' || !username || !userId) {
      console.debug('[IamStore] rehydrate aborted: token/username/userId missing or invalid');
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

  /**
   * Initializes FCM for the currently authenticated user.
   * Requests Notification permission, registers the service worker, retrieves the FCM
   * token, and sends it to the backend. Idempotent - safe to call multiple times.
   * Called automatically after sign-in and from MainLayout.ngOnInit for rehydrated sessions.
   */
  async initFcmForCurrentUser(): Promise<void> {
    const userId = this.currentUserIdSignal();
    if (!userId || !this.isSignedInSignal()) {
      return;
    }

    const token = await this.fcmService.initAndGetToken();
    if (!token) {
      return;
    }

    this.iamApi.registerFcmToken(userId, token).subscribe({
      next: () => console.debug('[FCM] Token registered with backend for user', userId),
      error: err => console.error('[FCM] Failed to register token with backend:', err),
    });
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
        void router.navigate(iamNav.signUp(), { queryParams: { role: 'admin' } });
      }
    });
  }

  signIn(signInCommand: SignInCommand, router: Router) {
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

        this.initFcmForCurrentUser().catch(err =>
          console.error('[FCM] Failed to initialize FCM after sign-in:', err)
        );

        if (signInResource.roles.includes('ROLE_ADMIN')) {
          void router.navigate(nursingNav.nursingHomeNew());
        } else {
          void router.navigate(analyticsNav.dashboard());
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
        void router.navigate(iamNav.signUp());
      }
    });
  }

  signOut(router: Router) {
    this._cleanupFcm();

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('nursingHomeId');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRolesSignal.set([]);
    void router.navigate(appNav.home);
  }

  // Private

  private _cleanupFcm(): void {
    const userId = this.currentUserIdSignal();
    const storedToken = this.fcmService.storedToken();

    if (userId && storedToken) {
      this.iamApi.removeFcmToken(userId, storedToken).subscribe({
        next: () => console.debug('[FCM] Token removed from backend for user', userId),
        error: err => console.error('[FCM] Failed to remove token from backend:', err),
      });
    }

    this.fcmService.deleteCurrentToken().catch(err =>
      console.error('[FCM] Failed to delete Firebase token:', err)
    );
  }
}
