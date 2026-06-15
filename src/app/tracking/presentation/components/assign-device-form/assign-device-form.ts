import { Component, inject } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingStore } from '../../../application/tracking.store';
import { NursingStore } from '../../../../nursing/application/nursing.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { AssignDeviceCommand } from '../../../domain/model/assign-device.command';
import { trackingNav } from '../../tracking-routes';
import { Resident } from '../../../../nursing/domain/model/resident.entity';
import { map, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-assign-device-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    TranslatePipe,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './assign-device-form.html',
  styleUrl: './assign-device-form.css'
})
export class AssignDeviceForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trackingStore = inject(TrackingStore);
  private nursingStore = inject(NursingStore);
  private profilesStore = inject(ProfilesStore);

  deviceId: number | null = null;
  nursingHomeId: number = 0;

  searchControl = new FormControl<string | Resident>('', { validators: [Validators.required] });
  selectedResident: Resident | null = null;

  private residents$ = toObservable(this.nursingStore.residents);
  private personProfiles$ = toObservable(this.profilesStore.personProfiles);

  filteredResidents$ = combineLatest([
    this.residents$,
    this.personProfiles$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([residents, profiles, search]) => {
      if (typeof search === 'string') {
        this.selectedResident = null;
      }
      const term = typeof search === 'string' ? search.toLowerCase() : '';
      return residents
        .map(resident => ({
          resident,
          profile: profiles.find(p => p.id === resident.personProfileId) ?? null
        }))
        .filter(({ profile }) =>
          !term || (profile?.fullName.toLowerCase().includes(term) ?? false)
        );
    })

  );

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));

    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
    });

    this.nursingStore.loadResidentsByNursingHome(this.nursingHomeId);
    this.profilesStore.loadPersonProfiles();
  }

  displayFn(resident: Resident | null): string {
    if (!resident) return '';
    const profile = this.profilesStore.personProfiles()
      .find(p => p.id === resident.personProfileId);
    return profile?.fullName ?? '';
  }

  onResidentSelected(resident: Resident): void {
    this.selectedResident = resident;
  }

  submit(): void {
    if (!this.selectedResident || !this.deviceId) return;

    const command = new AssignDeviceCommand({
      deviceId: this.deviceId,
      residentId: this.selectedResident.id
    });

    this.trackingStore.assignDevice(command);
    this.router.navigate(trackingNav.devices()).then();
  }
}
