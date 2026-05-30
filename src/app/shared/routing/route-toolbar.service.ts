import { computed, inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AppRouteData, isAppRouteData } from './route-page-data';

@Injectable({ providedIn: 'root' })
export class RouteToolbarService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly pageDataSignal = signal<AppRouteData | null>(null);

  readonly pageData = this.pageDataSignal.asReadonly();
  readonly showBackButton = computed(() => this.pageDataSignal()?.showBackButton ?? false);
  readonly title = computed(() => this.pageDataSignal()?.title ?? '');
  readonly module = computed(() => this.pageDataSignal()?.module ?? '');
  readonly description = computed(() => this.pageDataSignal()?.description ?? '');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => this.readActivePageData())
      )
      .subscribe((data) => this.pageDataSignal.set(data));

    this.pageDataSignal.set(this.readActivePageData());
  }

  goBack(): void {
    this.location.back();
  }

  private readActivePageData(): AppRouteData | null {
    let route = this.router.routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data as Record<string, unknown>;

    if (!isAppRouteData(data)) {
      return null;
    }

    return data;
  }
}
