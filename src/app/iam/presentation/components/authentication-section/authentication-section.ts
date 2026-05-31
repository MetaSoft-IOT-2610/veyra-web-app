import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { iamNav } from '../../iam.routes';
import { nursingNav } from '../../../../nursing/presentation/nursing-routes';
import { analyticsNav } from '../../../../analytics/presentation/analytics-routes';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';

@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [MatButtonModule, MatDivider, MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css'
})
export class AuthenticationSection {
  private readonly router = inject(Router);
  protected readonly store = inject(IamStore);

  /** Subtítulo rol (misma clave en disparador y cabecera del menú desplegable). */
  protected get roleSubtitleKey(): string {
    const roles = this.store.currentRoles();
    if (roles.includes('ROLE_ADMIN')) {
      return 'iam.role.admin-support';
    }
    return 'iam.role.user';
  }

  performSignIn(): void {
    void this.router.navigate(iamNav.signIn());
  }

  performSignUpUser(): void {
    void this.router.navigate(iamNav.signUp(), {
      queryParams: { role: 'user' }
    });
  }

  performSignUpAdmin(): void {
    void this.router.navigate(iamNav.signUp(), {
      queryParams: { role: 'admin' }
    });
  }

  /**
   * Entrada principal de la app según rol (misma lógica que post-login hasta tener ruta /perfil).
   */
  openProfile(): void {
    const roles = this.store.currentRoles();
    if (roles.includes('ROLE_ADMIN')) {
      void this.router.navigate(nursingNav.nursingHomeNew());
    } else {
      void this.router.navigate(analyticsNav.dashboard());
    }
  }

  performSignOut(): void {
    this.store.signOut(this.router);
  }
}
