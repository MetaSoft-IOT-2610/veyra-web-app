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
import {NursingStore} from '../../../../nursing/application/nursing.store';
import {ProfilesStore} from '../../../../profiles/application/profiles.store';

import {MatCard, MatCardContent} from '@angular/material/card';
import {MatChip} from '@angular/material/chips';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-device-detail',
  imports: [
    TranslatePipe,
    MatIcon,
    MatButton,
    MatDivider,
    MatIconButton,
    DatePipe,
    MatFormField,
    MatLabel,
    MatCard,
    MatCardContent,
    MatChip
  ],
  templateUrl: './device-detail.html',
  styleUrl: './device-detail.css',
})
export class DeviceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(TrackingStore);
  private nursingStore = inject(NursingStore);
  private profilesStore = inject(ProfilesStore);
  device: Device | null = null;
  deviceId: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      if (this.deviceId) {
        this.device = this.store.getDeviceById(this.deviceId)() ?? null;
        // Cargar datos necesarios para resolver el nombre
        const nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
        this.nursingStore.loadResidentsByNursingHome(nursingHomeId);
        this.profilesStore.loadPersonProfiles();
      }
    });
  }
  residentName(): string {
    if (!this.device?.residentId) return '';
    const resident = this.nursingStore.residents()
      .find(r => r.id === this.device!.residentId);
    if (!resident) return '';
    const profile = this.profilesStore.personProfiles()
      .find(p => p.id === resident.personProfileId);
    return profile?.fullName ?? '';
  }

  getStatusClass(): string {
    if (!this.device) return '';
    return {
      [DeviceStatus.AVAILABLE]: 'status-available',
      [DeviceStatus.ASSIGNED]:  'status-assigned',
      [DeviceStatus.UNAVAILABLE]:  'status-unavailable',
    }[this.device.status] ?? '';
  }

  getStatusIcon(): string {
    if (!this.device) return 'help';
    return {
      [DeviceStatus.AVAILABLE]: 'wifi_tethering',
      [DeviceStatus.ASSIGNED]:  'person_pin',
      [DeviceStatus.UNAVAILABLE]:  'wifi_off',
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
