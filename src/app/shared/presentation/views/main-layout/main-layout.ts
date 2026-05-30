import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouteToolbarService } from '../../../routing/route-toolbar.service';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';
import { AuthenticationSection } from '../../../../iam/presentation/components/authentication-section/authentication-section';
import { IamStore } from '../../../../iam/application/iam.store';
import { environment } from '../../../../../environments/environment';
import { analyticsPaths } from '../../../../analytics/presentation/analytics-routes';
import { nursingPaths } from '../../../../nursing/presentation/nursing-routes';
import { hcmPaths } from '../../../../hcm/presentation/hcm-routes';
import { activitiesPaths } from '../../../../activities/presentation/activities-routes';
import { alertsPaths } from '../../../../alerts/presentation/alerts-routes';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    LanguageSwitcher,
    AuthenticationSection
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout implements OnInit, AfterViewInit {
  private readonly iamStore = inject(IamStore);
  protected readonly routeToolbar = inject(RouteToolbarService);

  /** Si es true, toolbar muestra IAM completo (login/registro). Si es false, solo con sesión activa (perfil / salir). */
  protected readonly showIamToolbar = environment.showIamToolbar;

  /** Muestra `app-authentication-section` cuando el entorno habilita IAM o el usuario ya inició sesión. */
  protected showAuthenticationInToolbar(): boolean {
    return this.showIamToolbar || this.iamStore.isSignedIn();
  }

  @ViewChild(MatSidenav) drawer!: MatSidenav;
  @ViewChild('shell', { read: MatSidenavContainer }) private shell?: MatSidenavContainer;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  /**
   * Modo escritorio (`side`): ancho reducido tipo “mini” (iconos + tooltips), sin cerrar el drawer.
   * En móvil (`over`) no aplica; allí se usa abrir/cerrar overlay.
   */
  readonly navCollapsed = signal(false);

  options = [
    { label: 'nav.dashboard', icon: 'home', link: `/analytics/${analyticsPaths.dashboard}`, color: '#5FC2BA' },
    { label: 'nav.device', icon: 'assignment', link: `/nursing/${nursingPaths.devices}`, color: '#5FC2BA' },
    { label: 'nav.resident', icon: 'person', link: `/nursing/${nursingPaths.residents}`, color: '#5FC2BA' },
    { label: 'nav.staff', icon: 'group', link: `/hcm/${hcmPaths.staff}`, color: '#5FC2BA' },
    { label: 'nav.room', icon: 'meeting_room', link: `/nursing/${nursingPaths.rooms}`, color: '#5FC2BA' },
    { label: 'nav.activities', icon: 'event_note', link: `/activities${activitiesPaths.list}`, color: '#5FC2BA' },
    { label: 'nav.alerts', icon: 'notifications_active', link: `/alerts${alertsPaths.list}`, color: '#5FC2BA' },
    { label: 'nav.activities', icon: 'event_note', link: `/activities${activitiesPaths.list}`, color: '#5FC2BA' },
    { label: 'nav.alerts', icon: 'notifications_active', link: `/alerts${alertsPaths.list}`, color: '#5FC2BA' },
    { label: 'nav.relatives', icon: 'people', link: `/nursing/${nursingPaths.relatives}`, color: '#5FC2BA' },
    { label: 'my-patients', icon: 'favorite', link: `/nursing/${nursingPaths.myPatients}`, color: '#5FC2BA' },
  ];

  constructor(
    private readonly router: Router,
    private readonly observer: BreakpointObserver
  ) {
    this.observer.observe(['(max-width: 768px)']).subscribe(result => {
      if (result.matches) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
        this.navCollapsed.set(false);
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
      this.scheduleDrawerMarginRecalc();
    });
  }

  ngOnInit(): void {
    this.iamStore.tryApplyDevFallbackSession();
  }

  ngAfterViewInit(): void {
    this.scheduleDrawerMarginRecalc();
  }

  /**
   * El drawer en modo `side` aplica margin al contenido según el ancho medido del sidenav.
   * Al colapsar solo con CSS, hay que forzar recálculo (autosize + updateContentMargins).
   */
  private scheduleDrawerMarginRecalc(): void {
    const run = () => this.shell?.updateContentMargins();
    queueMicrotask(run);
    requestAnimationFrame(run);
    setTimeout(run, 0);
    setTimeout(run, 120);
    setTimeout(run, 360);
  }

  toggleDesktopNav(): void {
    if (this.sidenavMode !== 'side') {
      return;
    }
    this.navCollapsed.update(c => !c);
    this.scheduleDrawerMarginRecalc();
  }

  closeMobileDrawer(): void {
    if (this.sidenavMode !== 'over') {
      return;
    }
    this.sidenavOpened = false;
    void this.drawer?.close();
    this.scheduleDrawerMarginRecalc();
  }

  openMobileDrawer(): void {
    if (this.sidenavMode !== 'over') {
      return;
    }
    this.sidenavOpened = true;
    void this.drawer?.open();
    this.scheduleDrawerMarginRecalc();
  }

  onSidenavOpenedChange(opened: boolean): void {
    this.sidenavOpened = opened;
    this.scheduleDrawerMarginRecalc();
  }

  navigateTo(link: string) {
    void this.router.navigateByUrl(link);
    if (this.sidenavMode === 'over') {
      void this.drawer.close();
    }
  }

  isActive(link: string): boolean {
    return this.router.url.includes(link);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
