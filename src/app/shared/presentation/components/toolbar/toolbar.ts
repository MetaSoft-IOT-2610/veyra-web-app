import { Component, inject } from '@angular/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { RouteToolbarService } from '../../../routing/route-toolbar.service';

@Component({
  selector: 'app-toolbar',
  imports: [LanguageSwitcher, MatToolbar, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  protected readonly routeToolbar = inject(RouteToolbarService);
}
