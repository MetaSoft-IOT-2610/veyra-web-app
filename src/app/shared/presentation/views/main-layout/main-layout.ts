import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';
import { AuthenticationSection } from '../../../../iam/presentation/components/authentication-section/authentication-section';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
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
export class MainLayout {
  @ViewChild(MatSidenav) drawer!: MatSidenav;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  options = [
    { label: 'nav.dashboard', icon: 'home', link: '/analytics/dashboard', color: '#5FC2BA' },
    { label: 'nav.device', icon: 'assignment', link: '/nursing/devices', color: '#5FC2BA' },
    { label: 'nav.resident', icon: 'person', link: '/nursing/residents', color: '#5FC2BA' },
    { label: 'nav.staff', icon: 'group', link: '/hcm/staff', color: '#5FC2BA' },
    { label: 'nav.room', icon: 'meeting_room', link: '/nursing/rooms', color: '#5FC2BA' },
  ];

  constructor(
    private readonly router: Router,
    private readonly observer: BreakpointObserver
  ) {
    this.observer.observe(['(max-width: 768px)']).subscribe(result => {
      if (result.matches) {
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.sidenavOpened = true;
      }
    });
  }

  navigateTo(link: string) {
    void this.router.navigateByUrl(link);
    if (this.sidenavMode === 'over') {
      void this.drawer.toggle();
    }
  }

  isActive(link: string): boolean {
    return this.router.url.includes(link);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
