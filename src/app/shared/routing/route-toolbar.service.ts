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

  private readonly dynamicContext = signal<{ module?: string; description?: string } | null>(null);

  readonly module = computed(
    () => this.dynamicContext()?.module ?? this.pageDataSignal()?.module ?? ''
  );
  readonly description = computed(
    () => this.dynamicContext()?.description ?? this.pageDataSignal()?.description ?? ''
  );

  /** Override toolbar headings until navigation or {@link clearDynamicContext}. */
  setDynamicContext(context: { module?: string; description?: string } | null): void {
    this.dynamicContext.set(context);
  }

  clearDynamicContext(): void {
    this.dynamicContext.set(null);
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => this.readActivePageData())
      )
      .subscribe((data) => {
        this.dynamicContext.set(null);
        this.pageDataSignal.set(data);
      });

    this.pageDataSignal.set(this.readActivePageData());
  }

  goBack(): void {
    this.location.back();
  }

  //stops crashing when refreshing the page
  private readActivePageData(): AppRouteData | null {
    let route = this.router.routerState?.root;
    if (!route) {
      return null;
    }

    while (route.firstChild) {
      route = route.firstChild;
      if (!route) {
        return null;
      }
    }

    const snapshot = (route as any).snapshot;
    if (!snapshot || !snapshot.data) {
      return null;
    }

    const data = snapshot.data as Record<string, unknown>;

    if (!isAppRouteData(data)) {
      return null;
    }

    return data;
  }
}
