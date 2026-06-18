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
import { UnassignDeviceDialog } from '../../components/unassign-device-dialog/unassign-device-dialog';
import {ProfilesStore} from '../../../../profiles/application/profiles.store';
import {NursingStore} from '../../../../nursing/application/nursing.store';

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
  readonly store    = inject(TrackingStore);
  protected router  = inject(Router);
  private dialog    = inject(MatDialog);
  private snackBar  = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private nursingStore = inject(NursingStore);
  private profilesStore = inject(ProfilesStore);
  readonly DeviceStatus = DeviceStatus;

  readonly desktopColumns: string[] = ['deviceType', 'resident', 'assignedAt', 'status', 'actions'];
  readonly mobileColumns:  string[] = ['resident', 'status', 'actions'];
  displayedColumns: string[] = window.innerWidth < 768 ? this.mobileColumns : this.desktopColumns;

  nursingHomeId: number = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = computed(() => {
    const source = new MatTableDataSource(this.store.devices());
    source.sort      = this.sort;
    source.paginator = this.paginator;
    return source;
  });

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
    this.store.loadDevices(this.nursingHomeId);
    this.nursingStore.loadResidentsByNursingHome(this.nursingHomeId);
    this.profilesStore.loadPersonProfiles();
  }


  navigateToNew(): void { this.router.navigate(trackingNav.deviceNew()).then(); }
  viewDevice(id: number): void { this.router.navigate(trackingNav.deviceDetail(id)).then(); }
  editDevice(id: number): void { this.router.navigate(trackingNav.deviceEdit(id)).then(); }
  assignDevice(id: number): void { this.router.navigate(trackingNav.deviceAssign(id)).then(); }


  unassignDevice(device: any): void {
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

  availableTransitions(device: any): { labelKey: string; value: DeviceStatus }[] {
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
      [DeviceStatus.AVAILABLE]:   'chip-available',
      [DeviceStatus.ASSIGNED]:    'chip-assigned',
      [DeviceStatus.UNAVAILABLE]: 'chip-unavailable',
    };
    return map[status] ?? '';
  }

  chipIcon(status: DeviceStatus): string {
    const map: Record<DeviceStatus, string> = {
      [DeviceStatus.AVAILABLE]:   'wifi_tethering',
      [DeviceStatus.ASSIGNED]:    'person_pin',
      [DeviceStatus.UNAVAILABLE]: 'wifi_off',
    };
    return map[status] ?? 'help';
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

    const resident = this.nursingStore.residents()
      .find(r => r.id === residentId);
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
