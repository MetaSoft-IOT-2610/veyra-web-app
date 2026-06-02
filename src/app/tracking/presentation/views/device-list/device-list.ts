import { AfterViewChecked, Component, computed, inject, ViewChild } from '@angular/core';
import { TrackingStore } from '../../../application/tracking.store';
import { Router } from '@angular/router';
import { MatError } from '@angular/material/form-field';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {trackingNav} from '../../tracking-routes';

@Component({
  selector: 'app-device-list',
  imports: [
    MatError,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatProgressSpinner,
    TranslatePipe,
    MatIcon,
    MatIconButton,
    MatSort,
    MatSortHeader,
    MatPaginator
  ],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css'
})
export class DeviceList implements AfterViewChecked {
  readonly store = inject(TrackingStore);
  protected router = inject(Router);

  displayedColumns: string[] = [ 'deviceType', 'status', 'actions'];
  nursingHomeId: number = 0;

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

  ngAfterViewChecked(): void {
    if (this.dataSource().paginator !== this.paginator) {
      this.dataSource().paginator = this.paginator;
    }
    if (this.dataSource().sort !== this.sort) {
      this.dataSource().sort = this.sort;
    }
  }
}
