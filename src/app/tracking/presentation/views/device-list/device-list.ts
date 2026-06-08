import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { TrackingStore } from '../../../application/tracking.store';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { trackingNav } from '../../tracking-routes';
import { DeviceStatus } from '../../../domain/model/device-status.enum';
import { ChangeDeviceStatusCommand } from '../../../domain/model/change-device-status.command';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-device-list',
  imports: [
    MatTableModule, MatButtonModule, MatProgressSpinnerModule,
    MatIconModule, MatSortModule, MatPaginatorModule,
    MatSelectModule, MatFormFieldModule, MatChipsModule,
    TranslatePipe, FormsModule,
  ],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceList implements AfterViewChecked {
  readonly store = inject(TrackingStore);
  protected router = inject(Router);
  readonly DeviceStatus = DeviceStatus;

  displayedColumns: string[] = ['macAddress', 'deviceType', 'status', 'actions'];
  nursingHomeId: number = 0;

  readonly statusOptions = [
    { value: DeviceStatus.AVAILABLE, labelKey: 'tracking.devices.status-options.available' },
    { value: DeviceStatus.ASSIGNED,  labelKey: 'tracking.devices.status-options.assigned'  },
    { value: DeviceStatus.DISABLED,  labelKey: 'tracking.devices.status-options.disabled'  },
  ];

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
  }

  assignDevice(id: number): void {
    this.router.navigate(trackingNav.deviceAssign(id)).then();
  }

  navigateToNew(): void {
    this.router.navigate(trackingNav.deviceNew()).then();
  }

  editDevice(id: number): void {
    this.router.navigate(trackingNav.deviceEdit(id)).then();
  }

  onStatusChange(deviceId: number, newStatus: string): void {
    const command = new ChangeDeviceStatusCommand({ deviceId, status: newStatus });
    this.store.changeDeviceStatus(command);
  }

  ngAfterViewChecked(): void {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}
