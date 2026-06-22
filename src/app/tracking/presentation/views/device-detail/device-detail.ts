import {Component, effect, inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {trackingNav} from '../../tracking-routes';
import {DeviceStatus} from '../../../domain/model/device-status.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {TrackingStore} from '../../../application/tracking.store';
import {Device} from '../../../domain/model/device.entity';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {DatePipe, formatDate} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {NursingStore} from '../../../../nursing/application/nursing.store';
import {ProfilesStore} from '../../../../profiles/application/profiles.store';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatChip} from '@angular/material/chips';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {IotStatus} from '../../../domain/model/iot-status.enum';
import {ChangeIotStatusCommand} from '../../../domain/model/change-iot-status.command';
import {
  deviceTypeIcon,
  deviceTypeIconClass,
  deviceTypeLabelKey,
  isEdgeGateway,
  supportsTelemetry
} from '../../../domain/model/device-type.helpers';
import {interval, Subscription} from 'rxjs';
import {DeviceFormDialog} from '../../components/device-form-dialog/device-form-dialog';
import {RouteToolbarService} from '../../../../shared/routing/route-toolbar.service';
import {APP_DISPLAY_TIMEZONE} from '../../../../shared/utils/datetime';

@Component({
  selector: 'app-device-detail',
  imports: [
    TranslatePipe,
    MatIcon,
    MatButton,
    MatDivider,
    DatePipe,
    MatCard,
    MatCardContent,
    MatChip,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow
  ],
  templateUrl: './device-detail.html',
  styleUrl: './device-detail.css',
})
export class DeviceDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(TrackingStore);
  readonly nursingStore = inject(NursingStore);
  readonly profilesStore = inject(ProfilesStore);
  private readonly translate = inject(TranslateService);
  private readonly routeToolbar = inject(RouteToolbarService);
  private readonly locale = inject(LOCALE_ID);
  readonly displayTimezone = APP_DISPLAY_TIMEZONE;

  deviceId: number | null = null;
  readonly IotStatus = IotStatus;
  readonly isEdgeGateway = isEdgeGateway;
  readonly supportsTelemetry = supportsTelemetry;
  readonly deviceTypeIcon = deviceTypeIcon;
  readonly deviceTypeIconClass = deviceTypeIconClass;
  readonly deviceTypeLabelKey = deviceTypeLabelKey;
  private dialog = inject(MatDialog);
  telemetryColumns = ['timestamp', 'heartRate', 'oxygenSaturation', 'temperature'];

  private telemetryPoll?: Subscription;
  private pollingDeviceId: number | null = null;
  private residentContextNursingHomeId: number | null = null;
  private langChangeSub?: Subscription;

  constructor() {
    effect(() => {
      const device = this.device;
      if (device) {
        this.store.latestMeasurement();
        this.store.measurementsLoading();
        this.updateToolbarContext(device);
        return;
      }
      if (this.deviceId && this.store.loading()) {
        this.routeToolbar.setDynamicContext({
          module: this.translate.instant('tracking.devices.detail.title'),
          description: this.translate.instant('tracking.devices.detail.loading-subtitle'),
        });
      }
    });

    effect(() => {
      const id = this.deviceId;
      if (!id) return;
      const device = this.store.getDeviceById(id)();
      if (device && supportsTelemetry(device.deviceType) && this.pollingDeviceId !== id) {
        this.pollingDeviceId = id;
        this.startTelemetryPolling(id);
      }
    });

    effect(() => {
      const id = this.deviceId;
      if (!id) return;
      const device = this.store.getDeviceById(id)();
      const nursingHomeId = device?.nursingHomeId;
      if (!nursingHomeId || nursingHomeId <= 0) return;
      if (this.residentContextNursingHomeId === nursingHomeId) return;
      this.residentContextNursingHomeId = nursingHomeId;
      this.nursingStore.loadResidentsByNursingHome(nursingHomeId);
      this.nursingStore.loadRoomsByNursingHome(nursingHomeId);
      this.profilesStore.loadPersonProfiles();
    });
  }

  get device(): Device | null {
    if (!this.deviceId) return null;
    return this.store.getDeviceById(this.deviceId)() ?? null;
  }

  ngOnInit(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const current = this.device;
      if (current) {
        this.updateToolbarContext(current);
      }
    });

    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      this.residentContextNursingHomeId = null;
      this.pollingDeviceId = null;
      this.telemetryPoll?.unsubscribe();
      this.store.clearMeasurements();
      if (!this.deviceId) return;
      this.store.loadDeviceById(this.deviceId);
      const cached = this.store.getDeviceById(this.deviceId)();
      if (cached && supportsTelemetry(cached.deviceType)) {
        this.startTelemetryPolling(this.deviceId);
      }
    });
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
    this.telemetryPoll?.unsubscribe();
    this.store.clearMeasurements();
    this.routeToolbar.clearDynamicContext();
  }

  private updateToolbarContext(device: Device): void {
    this.routeToolbar.setDynamicContext({
      module: device.externalDeviceId,
      description: this.buildToolbarDescription(device),
    });
  }

  private buildToolbarDescription(device: Device): string {
    if (!supportsTelemetry(device.deviceType)) {
      return this.translate.instant(this.deviceTypeLabelKey(device.deviceType));
    }

    const latest = this.store.latestMeasurement();
    if (latest) {
      const formatted = formatDate(
        latest.timestamp,
        'dd/MM/yyyy HH:mm:ss',
        this.locale,
        APP_DISPLAY_TIMEZONE,
      );
      return this.translate.instant('tracking.devices.detail.last-update-subtitle', { date: formatted });
    }

    if (this.store.measurementsLoading()) {
      return this.translate.instant('tracking.devices.detail.loading-telemetry-subtitle');
    }

    return this.translate.instant('tracking.devices.detail.no-telemetry-subtitle');
  }

  private startTelemetryPolling(deviceId: number): void {
    this.telemetryPoll?.unsubscribe();
    this.store.loadDeviceMeasurements(deviceId);
    this.telemetryPoll = interval(10_000).subscribe(() => {
      this.store.loadDeviceMeasurements(deviceId);
    });
  }

  residentName(): string {
    return this.getAssignedResidentProfileName();
  }

  hasAssignedResident(): boolean {
    return this.device?.residentId != null;
  }

  isResidentProfileLoading(): boolean {
    if (!this.hasAssignedResident()) {
      return false;
    }
    if (this.getAssignedResidentProfileName()) {
      return false;
    }
    return this.nursingStore.loading() || this.profilesStore.loading();
  }

  getAssignedResidentProfileName(): string {
    if (!this.device?.residentId) {
      return '';
    }
    const resident = this.nursingStore.residents()
      .find(r => r.id === this.device!.residentId);
    if (!resident) {
      return '';
    }
    const profile = this.profilesStore.personProfiles()
      .find(p => p.id === resident.personProfileId);
    return profile?.fullName ?? '';
  }

  assignedRoomLabel(): string {
    if (!this.device?.residentId) {
      return '';
    }
    const resident = this.nursingStore.residents()
      .find(r => r.id === this.device!.residentId);
    if (!resident?.roomId) {
      return '';
    }
    const room = this.nursingStore.rooms().find(r => r.id === resident.roomId);
    return room?.roomNumber ?? '';
  }

  getStatusClass(): string {
    if (!this.device) return '';
    return {
      [DeviceStatus.AVAILABLE]: 'status-available',
      [DeviceStatus.ASSIGNED]: 'status-assigned',
      [DeviceStatus.UNAVAILABLE]: 'status-unavailable',
    }[this.device.status] ?? '';
  }

  getStatusIcon(): string {
    if (!this.device) return 'help';
    return {
      [DeviceStatus.AVAILABLE]: 'wifi_tethering',
      [DeviceStatus.ASSIGNED]: 'person_pin',
      [DeviceStatus.UNAVAILABLE]: 'wifi_off',
    }[this.device.status] ?? 'help';
  }

  getIotStatusClass(): string {
    if (!this.device) return '';
    return this.device.iotStatus === IotStatus.ACTIVE ? 'iot-active' : 'iot-revoked';
  }

  getDeviceDescriptionKey(): string {
    if (!this.device) return '';
    if (isEdgeGateway(this.device.deviceType)) return 'tracking.devices.detail.gateway-desc';
    if (this.device.deviceType === 'GPS') return 'tracking.devices.detail.gps-desc';
    return 'tracking.devices.detail.vital-desc';
  }

  toggleIotStatus(): void {
    if (!this.device) return;
    const nextStatus = this.device.iotStatus === IotStatus.ACTIVE ? IotStatus.REVOKED : IotStatus.ACTIVE;
    this.store.changeIotStatus(new ChangeIotStatusCommand({
      deviceId: this.device.id,
      iotStatus: nextStatus
    }));
  }

  refreshTelemetry(): void {
    if (this.deviceId) {
      this.store.loadDeviceMeasurements(this.deviceId);
    }
  }

  goBack(): void {
    this.router.navigate(trackingNav.devices()).then();
  }

  goToEdit(): void {
    if (!this.device) return;
    this.dialog.open(DeviceFormDialog, {
      width: '480px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        nursingHomeId: this.device.nursingHomeId,
        device: this.device
      }
    });
  }

  formatValue(value: number | null | undefined, suffix = ''): string {
    if (value === null || value === undefined) return '—';
    return `${value}${suffix}`;
  }
}
