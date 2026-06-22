import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { TrackingStore } from '../../../application/tracking.store';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { trackingNav } from '../../tracking-routes';
import { DeviceStatus } from '../../../domain/model/device-status.enum';
import { ChangeDeviceStatusCommand } from '../../../domain/model/change-device-status.command';
import { ChangeIotStatusCommand } from '../../../domain/model/change-iot-status.command';
import { UnassignDeviceDialog } from '../../components/unassign-device-dialog/unassign-device-dialog';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { NursingStore } from '../../../../nursing/application/nursing.store';
import { IotStatus } from '../../../domain/model/iot-status.enum';
import {
  deviceTypeIcon,
  deviceTypeIconClass,
  deviceTypeLabelKey,
  isAssignableDeviceType,
  isEdgeGateway,
  supportsTelemetry
} from '../../../domain/model/device-type.helpers';
import { Device } from '../../../domain/model/device.entity';
import {
  DeviceFormDialog,
  DeviceFormDialogData
} from '../../components/device-form-dialog/device-form-dialog';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    MatTableModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatSortModule, MatPaginatorModule,
    MatChipsModule, MatMenuModule, MatDividerModule,
    MatTooltipModule, TranslatePipe, DatePipe,
  ],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceList implements AfterViewChecked {
  readonly store = inject(TrackingStore);
  protected router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private nursingStore = inject(NursingStore);
  private profilesStore = inject(ProfilesStore);
  readonly DeviceStatus = DeviceStatus;
  readonly IotStatus = IotStatus;
  readonly isEdgeGateway = isEdgeGateway;
  readonly isAssignableDeviceType = isAssignableDeviceType;
  readonly supportsTelemetry = supportsTelemetry;
  readonly deviceTypeIcon = deviceTypeIcon;
  readonly deviceTypeIconClass = deviceTypeIconClass;
  readonly deviceTypeLabelKey = deviceTypeLabelKey;

  readonly desktopColumns: string[] = [
    'deviceType', 'externalDeviceId', 'resident', 'assignedAt', 'iotStatus', 'status', 'actions'
  ];
  readonly mobileColumns: string[] = ['externalDeviceId', 'status', 'actions'];
  displayedColumns: string[] = window.innerWidth < 768 ? this.mobileColumns : this.desktopColumns;

  nursingHomeId = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.devices());
    source.sort = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
    this.store.loadDevices(this.nursingHomeId);
    this.nursingStore.loadResidentsByNursingHome(this.nursingHomeId);
    this.profilesStore.loadPersonProfiles();
  }

  navigateToNew(): void { this.openDeviceDialog('create'); }

  editDevice(device: Device): void { this.openDeviceDialog('edit', device); }

  private openDeviceDialog(mode: 'create' | 'edit', device?: Device): void {
    const data: DeviceFormDialogData = {
      mode,
      nursingHomeId: this.nursingHomeId,
      device
    };
    const ref = this.dialog.open(DeviceFormDialog, {
      width: '480px',
      maxWidth: '95vw',
      data,
      autoFocus: 'first-tabbable',
    });
    ref.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        const key = mode === 'create'
          ? 'tracking.devices.form.register-success'
          : 'tracking.devices.form.update-success';
        this.showSnack(key);
      }
    });
  }

  viewDevice(id: number): void { this.router.navigate(trackingNav.deviceDetail(id)).then(); }
  assignDevice(id: number): void { this.router.navigate(trackingNav.deviceAssign(id)).then(); }

  unassignDevice(device: Device): void {
    const ref = this.dialog.open(UnassignDeviceDialog, {
      width: '420px',
      data: { device }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.unassignDevice(device.id);
        this.showSnack('tracking.devices.unassign-success');
      }
    });
  }

  changeStatus(deviceId: number, newStatus: DeviceStatus): void {
    const command = new ChangeDeviceStatusCommand({ deviceId, status: newStatus });
    this.store.changeDeviceStatus(command);
    this.showSnack('tracking.devices.status-changed');
  }

  toggleIotStatus(device: Device): void {
    const nextStatus = device.iotStatus === IotStatus.ACTIVE ? IotStatus.REVOKED : IotStatus.ACTIVE;
    this.store.changeIotStatus(new ChangeIotStatusCommand({
      deviceId: device.id,
      iotStatus: nextStatus
    }));
    this.showSnack(nextStatus === IotStatus.REVOKED
      ? 'tracking.devices.iot-revoked'
      : 'tracking.devices.iot-activated');
  }

  availableTransitions(device: Device): { labelKey: string; value: DeviceStatus }[] {
    if (device.status === DeviceStatus.AVAILABLE) {
      return [{ labelKey: 'tracking.devices.status-options.unavailable', value: DeviceStatus.UNAVAILABLE }];
    }
    if (device.status === DeviceStatus.UNAVAILABLE) {
      return [{ labelKey: 'tracking.devices.status-options.available', value: DeviceStatus.AVAILABLE }];
    }
    return [];
  }

  chipClass(status: DeviceStatus): string {
    const map: Record<DeviceStatus, string> = {
      [DeviceStatus.AVAILABLE]: 'chip-available',
      [DeviceStatus.ASSIGNED]: 'chip-assigned',
      [DeviceStatus.UNAVAILABLE]: 'chip-unavailable',
    };
    return map[status] ?? '';
  }

  chipIcon(status: DeviceStatus): string {
    const map: Record<DeviceStatus, string> = {
      [DeviceStatus.AVAILABLE]: 'wifi_tethering',
      [DeviceStatus.ASSIGNED]: 'person_pin',
      [DeviceStatus.UNAVAILABLE]: 'wifi_off',
    };
    return map[status] ?? 'help';
  }

  iotChipClass(iotStatus: string): string {
    return iotStatus === IotStatus.ACTIVE ? 'chip-iot-active' : 'chip-iot-revoked';
  }

  onResize(): void {
    this.displayedColumns = window.innerWidth < 768 ? this.mobileColumns : this.desktopColumns;
  }

  ngAfterViewChecked(): void {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }

  residentName(residentId: number | null): string {
    if (!residentId) return '';
    const resident = this.nursingStore.residents().find(r => r.id === residentId);
    if (!resident) return '';
    const profile = this.profilesStore.personProfiles()
      .find(p => p.id === resident.personProfileId);
    return profile?.fullName ?? '';
  }

  private showSnack(key: string): void {
    this.translate.get(key).subscribe(msg =>
      this.snackBar.open(msg, '✕', { duration: 3000 })
    );
  }
}
