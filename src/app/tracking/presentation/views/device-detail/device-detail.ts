import {Component, inject, OnInit} from '@angular/core';
import {trackingNav} from '../../tracking-routes';
import {DeviceStatus} from '../../../domain/model/device-status.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {TrackingStore} from '../../../application/tracking.store';
import {Device} from '../../../domain/model/device.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-device-detail',
  imports: [
    TranslatePipe,
    MatIcon,
    MatButton,
    MatDivider,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './device-detail.html',
  styleUrl: './device-detail.css',
})
export class DeviceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(TrackingStore);
  readonly DeviceStatus = DeviceStatus;

  device: Device | null = null;
  deviceId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      if (this.deviceId) {
        this.device = this.store.getDeviceById(this.deviceId)() ?? null;
      }
    });
  }

  getStatusClass(): string {
    if (!this.device) return '';
    return {
      [DeviceStatus.AVAILABLE]: 'status-available',
      [DeviceStatus.ASSIGNED]:  'status-assigned',
      [DeviceStatus.DISABLED]:  'status-disabled',
    }[this.device.status] ?? '';
  }

  getStatusIcon(): string {
    if (!this.device) return 'help';
    return {
      [DeviceStatus.AVAILABLE]: 'wifi_tethering',
      [DeviceStatus.ASSIGNED]:  'person_pin',
      [DeviceStatus.DISABLED]:  'wifi_off',
    }[this.device.status] ?? 'help';
  }

  getDeviceIcon(): string {
    return this.device?.deviceType === 'GPS' ? 'location_on' : 'monitor_heart';
  }

  goBack(): void {
    this.router.navigate(trackingNav.devices()).then();
  }

  goToEdit(): void {
    if (this.deviceId) {
      this.router.navigate(trackingNav.deviceEdit(this.deviceId)).then();
    }
  }
}
