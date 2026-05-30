import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { nursingNav } from '../../nursing-routes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NursingStore } from '../../../application/nursing.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { Resident } from '../../../domain/model/resident.entity';
import { PersonProfile } from '../../../../profiles/domain/model/person-profile.entity';
import { CreateRelativeCommand } from '../../../domain/model/create-relative.command';

export interface ResidentWithProfile {
  resident: Resident;
  profile: PersonProfile | undefined;
}

@Component({
  selector: 'app-relative-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './relative-form.html',
  styleUrls: ['./relative-form.css']
})
export class RelativeForm {
  private readonly router = inject(Router);
  private readonly nursingStore = inject(NursingStore);
  private readonly profilesStore = inject(ProfilesStore);

  readonly residentsWithProfiles = computed<ResidentWithProfile[]>(() =>
    this.nursingStore.residents().map(resident => ({
      resident,
      profile: this.profilesStore.personProfiles().find(p => p.id === resident.personProfileId)
    }))
  );

  readonly selectedEntry = signal<ResidentWithProfile | null>(null);
  readonly showResidentDropdown = signal<boolean>(false);

  readonly form: FormGroup = inject(FormBuilder).group({
    firstName:  ['', Validators.required],
    lastName:   ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    residentId: [null, Validators.required],
  });

  constructor() {

    const nursingHomeId = 0;
    if (nursingHomeId) {
      this.nursingStore.loadResidentsByNursingHome(nursingHomeId);
    }
    this.profilesStore.loadPersonProfiles();
  }

  toggleResidentDropdown(): void {
    this.showResidentDropdown.update(v => !v);
  }

  selectEntry(entry: ResidentWithProfile): void {
    this.selectedEntry.set(entry);
    this.form.patchValue({ residentId: entry.resident.id });
    this.showResidentDropdown.set(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const residentId = Number(this.form.value.residentId);
    if (!residentId) {
      console.error('Resident ID is required');
      return;
    }


    const command = new CreateRelativeCommand({
      firstName: this.form.value.firstName,
      lastName:  this.form.value.lastName,
      email:     this.form.value.email,
      residentId: residentId
    });

    // Pasar nursingHomeId como primer parámetro (el endpoint espera
    // POST /nursing-homes/{nursingHomeId}/relatives)
    this.nursingStore.addRelative(0, command);
    void this.router.navigate(nursingNav.relatives());
  }

  onCancel(): void {
    void this.router.navigate(nursingNav.relatives());
  }
}
