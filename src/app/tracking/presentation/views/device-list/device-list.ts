import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { LayoutNursingHome } from '../../../../shared/presentation/components/layout-nursing-home/layout-nursing-home';
import { TrackingStore } from '../../../application/tracking.store';
import { DeviceType } from '../../../domain/model/device-type.enum';
import { DeviceStatus } from '../../../domain/model/device-status.enum';
import { Device } from '../../../domain/model/device.entity';
import { CreateDeviceCommand } from '../../../domain/model/create-device.command';
import {
  RegisterDeviceDialog,
  RegisterDeviceDialogData
} from '../register-device-dialog/register-device-dialog';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    NgClass,
    LayoutNursingHome,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceList {
  readonly store = inject(TrackingStore);
  private readonly dialog = inject(MatDialog);

  @ViewChild('vitalSignsPaginator') vitalSignsPaginator!: MatPaginator;
  @ViewChild('gpsPaginator') gpsPaginator!: MatPaginator;

  readonly displayedColumns = ['deviceId', 'assignedBy', 'assignedAt', 'status', 'actions'];
  readonly DeviceStatus = DeviceStatus;
  readonly pageSize = 6;

  searchTerm = signal('');
  vitalSignsPage = signal<PageEvent>({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
  gpsPage = signal<PageEvent>({ pageIndex: 0, pageSize: this.pageSize, length: 0 });

  private vitalSignsDevices = computed(() =>
    this.store.devices().filter(d => d.deviceType === DeviceType.VITAL_SIGNS)
  );

  private gpsDevices = computed(() =>
    this.store.devices().filter(d => d.deviceType === DeviceType.GPS)
  );

  filteredVitalSigns = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.vitalSignsDevices();
    return term ? all.filter(d => d.deviceId.toLowerCase().includes(term)) : all;
  });

  filteredGps = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.gpsDevices();
    return term ? all.filter(d => d.deviceId.toLowerCase().includes(term)) : all;
  });

  pagedVitalSigns = computed(() => {
    const { pageIndex, pageSize } = this.vitalSignsPage();
    const all = this.filteredVitalSigns();
    return all.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  });

  pagedGps = computed(() => {
    const { pageIndex, pageSize } = this.gpsPage();
    const all = this.filteredGps();
    return all.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  });

  vitalSignsShowingText = computed(() => {
    const { pageIndex, pageSize } = this.vitalSignsPage();
    const total = this.filteredVitalSigns().length;
    if (total === 0) return '';
    const from = pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, total);
    return `${from} - ${to} / ${total}`;
  });

  gpsShowingText = computed(() => {
    const { pageIndex, pageSize } = this.gpsPage();
    const total = this.filteredGps().length;
    if (total === 0) return '';
    const from = pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, total);
    return `${from} - ${to} / ${total}`;
  });

  nursingHomeId: number = Number(localStorage.getItem('nursingHomeId'));

  constructor() {
    this.store.loadDevices(this.nursingHomeId);
  }

  onVitalSignsPage(event: PageEvent): void {
    this.vitalSignsPage.set(event);
  }

  onGpsPage(event: PageEvent): void {
    this.gpsPage.set(event);
  }

  openRegisterDialog(device?: Device): void {
    const data: RegisterDeviceDialogData = { device };
    const ref = this.dialog.open(RegisterDeviceDialog, {
      data,
      width: '480px',
      disableClose: false
    });

    ref.afterClosed().subscribe((command: CreateDeviceCommand | undefined) => {
      if (!command) return;
      if (device) {
        this.store.editDevice(device.id, command);
      } else {
        this.store.addDevice(this.nursingHomeId, command);
      }
    });
  }

  deleteDevice(id: number): void {
    this.store.removeDevice(id);
  }

  getStatusClass(status: DeviceStatus): string {
    switch (status) {
      case DeviceStatus.ACTIVE:      return 'status-active';
      case DeviceStatus.INACTIVE:    return 'status-inactive';
      case DeviceStatus.LOW_BATTERY: return 'status-low-battery';
      default:                       return '';
    }
  }
}
