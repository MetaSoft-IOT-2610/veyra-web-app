import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { nursingNav } from '../../nursing-routes';
import { MatCard } from '@angular/material/card';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { NursingStore } from '../../../application/nursing.store';
import { PersonProfileDetail } from '../../../../profiles/presentation/components/person-profile-detail/person-profile-detail';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-resident-detail',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    MatError,
    MatFabButton,
    TranslatePipe,
    PersonProfileDetail,
    ReactiveFormsModule
  ],
  templateUrl: './resident-detail.html',
  styleUrl: './resident-detail.css'
})
export class ResidentDetail {
  protected store = inject(NursingStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  residentId = signal<number | null>(null);

  resident = computed(() => {
    const id = this.residentId();
    if (!id) return undefined;
    const residentSignal = this.store.getResidentById(id);
    return residentSignal();
  });

  personProfileId = computed(() => {
    const res = this.resident();
    return res ? res.personProfileId : null;
  });

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId.set(id);

      if (!id) {
        void this.router.navigate(nursingNav.residents());
      }
    });
  }

  goBack() {
    void this.router.navigate(nursingNav.residents());
  }

  editResident() {
    const id = this.residentId();
    if (id) {
      void this.router.navigate(nursingNav.residentEdit(id));
    }
  }

  viewMedicalHistory() {
    const id = this.residentId();
    if (id) {
      void this.router.navigate(nursingNav.medicalRecords(id));
    }
  }

  editVitalSignThresholds() {
    const id = this.residentId();
    if (id) {
      void this.router.navigate(nursingNav.vitalSignThresholds(id));
    }
  }
}
