import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { nursingNav } from '../../../../nursing/presentation/nursing-routes';
import { hcmNav } from '../../../../hcm/presentation/hcm-routes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertsStore } from '../../../application/alerts.store';
import { Alert, AlertSeverity } from '../../../domain/model/alert.entity';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './alerts-list.html',
  styleUrl: './alerts-list.css',
})
export class AlertsList implements OnInit {
  protected readonly store = inject(AlertsStore);
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  readonly selectedFilter = signal<AlertSeverity | 'ALL'>('ALL');
  readonly selectedAlert = signal<Alert | null>(null);

  readonly filters: { key: AlertSeverity | 'ALL'; labelKey: string }[] = [
    { key: 'ALL',     labelKey: 'alerts.filter.all' },
    { key: 'URGENT',  labelKey: 'alerts.filter.urgent' },
    { key: 'WARNING', labelKey: 'alerts.filter.warning' },
    { key: 'INFO',    labelKey: 'alerts.filter.info' },
  ];

  readonly filteredAlerts = computed(() => {
    const filter = this.selectedFilter();
    const all = this.store.alerts();
    return filter === 'ALL' ? all : all.filter(a => a.severity === filter);
  });

  get nursingHomeId(): number {
    return Number(localStorage.getItem('nursingHomeId')) || 0;
  }

  get currentUsername(): string {
    return this.iamStore.currentUsername() ?? 'staff';
  }

  ngOnInit(): void {
    if (this.nursingHomeId) {
      this.store.loadAlerts(this.nursingHomeId);
    } else {
      this.store.loadAllAlerts();
    }
  }

  setFilter(filter: AlertSeverity | 'ALL'): void {
    this.selectedFilter.set(filter);
  }

  openDetail(alert: Alert): void {
    this.selectedAlert.set(alert);
    if (alert.isUnread) {
      this.store.markAsRead(alert.id);
    }
  }

  closeDetail(): void {
    this.selectedAlert.set(null);
  }

  onAcknowledge(alert: Alert): void {
    this.store.acknowledgeAlert(alert.id, this.currentUsername);
  }

  onMarkAllAsRead(): void {
    this.store.markAllAsRead(this.nursingHomeId);
  }

  onAttendImmediately(alert: Alert): void {
    void this.router.navigate(nursingNav.residentDetail(alert.residentId));
  }

  onViewHistory(alert: Alert): void {
    void this.router.navigate(nursingNav.medicalRecords(alert.residentId));
  }

  onViewVitalSigns(alert: Alert): void {
    void this.router.navigate(nursingNav.medicalRecords(alert.residentId));
  }

  onContactStaff(): void {
    void this.router.navigate(hcmNav.staff());
  }

  severityClass(severity: AlertSeverity): string {
    const map: Record<AlertSeverity, string> = {
      URGENT:  'urgent',
      WARNING: 'warning',
      INFO:    'info',
    };
    return map[severity];
  }

  sourceLabel(source: string): string {
    const map: Record<string, string> = {
      STAFF:  'Caregiver',
      SYSTEM: 'App System',
      IOT:    'Veyra IoT System',
    };
    return map[source] ?? source;
  }

  timeAgo(isoDate: string): string {
    const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  isUrgent(alert: Alert): boolean { return alert.severity === 'URGENT'; }
  isWarning(alert: Alert): boolean { return alert.severity === 'WARNING'; }
  isInfo(alert: Alert): boolean { return alert.severity === 'INFO'; }
  isAutomatic(alert: Alert): boolean { return alert.source === 'IOT' || alert.source === 'SYSTEM'; }
  isUnread(alert: Alert): boolean { return alert.status === 'UNREAD'; }
  isAcknowledged(alert: Alert): boolean { return alert.status === 'ACKNOWLEDGED'; }
}
