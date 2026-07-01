import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingStore } from '../../../application/tracking.store';
import { NursingStore } from '../../../../nursing/application/nursing.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AssignDeviceCommand } from '../../../domain/model/assign-device.command';
import { isAssignableDeviceType } from '../../../domain/model/device-type.helpers';
import { trackingNav } from '../../tracking-routes';
import { Resident } from '../../../../nursing/domain/model/resident.entity';
import { PersonProfileDetail } from '../../../../profiles/presentation/components/person-profile-detail/person-profile-detail';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-assign-device-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule,
    PersonProfileDetail,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatError,
  ],
  templateUrl: './assign-device-form.html',
  styleUrl: './assign-device-form.css'
})
export class AssignDeviceForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trackingStore = inject(TrackingStore);
  protected nursingStore = inject(NursingStore);
  private profilesStore = inject(ProfilesStore);

  deviceId: number | null = null;
  nursingHomeId: number = 0;

  searchTerm = signal('');
  selectedResident = signal<Resident | null>(null);

  protected residents = computed(() => this.nursingStore.residents());
  protected profiles = computed(() => this.profilesStore.personProfiles());
  protected selectedResidentId = computed(() => this.selectedResident()?.id ?? null);
  protected filteredResidents = computed(() => {
    const term = this.removeAccents(this.searchTerm());
    const profiles = this.profiles();
    const residents = this.residents();

    if (!term) return residents;

    return residents.filter(resident => {
      const profile = profiles.find(p => p.id === resident.personProfileId);
      return profile ? this.removeAccents(profile.fullName).includes(term) : false;
    });
  });

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
    this.trackingStore.loadDevices(this.nursingHomeId);

    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      if (this.deviceId) {
        const device = this.trackingStore.getDeviceById(this.deviceId)();
        if (device && !isAssignableDeviceType(device.deviceType)) {
          this.router.navigate(trackingNav.devices()).then();
        }
      }
    });

    this.nursingStore.loadResidentsByNursingHome(this.nursingHomeId);
    this.profilesStore.loadPersonProfiles();
  }

  selectResident(resident: Resident): void {
    const current = this.selectedResident();
    this.selectedResident.set(current?.id === resident.id ? null : resident);
  }

  residentRoomLabel(resident: Resident): string {
    return resident.roomId != null ? resident.roomId.toString() : 'N/A';
  }

  submit(): void {
    const resident = this.selectedResident();
    if (!resident || !this.deviceId) return;

    const command = new AssignDeviceCommand({
      deviceId: this.deviceId,
      residentId: resident.id
    });

    this.trackingStore.assignDevice(command);
    this.router.navigate(trackingNav.devices()).then();
  }

  goBack(): void {
    this.router.navigate(trackingNav.devices()).then();
  }

  private removeAccents(word: string): string {
    return word.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
  }
}
