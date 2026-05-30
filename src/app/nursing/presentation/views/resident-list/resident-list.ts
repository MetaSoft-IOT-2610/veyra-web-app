import {Component, computed, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { nursingNav } from '../../nursing-routes';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule }  from '@angular/forms';
import { NursingStore } from '../../../application/nursing.store';
import { PersonProfileDetail } from '../../../../profiles/presentation/components/person-profile-detail/person-profile-detail';

@Component({
  selector: 'app-resident-list',
  standalone: true,
  imports: [
    TranslatePipe,
    MatProgressSpinner,
    MatError,
    MatCard,
    MatIcon,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatIconButton,
    MatInputModule,
    MatFormFieldModule,
    PersonProfileDetail
  ],
  templateUrl: './resident-list.html',
  styleUrl: './resident-list.css'
})
export class ResidentList {
  readonly store = inject(NursingStore);
  protected router = inject(Router);

  nursingHomeId: number = Number(localStorage.getItem('nursingHomeId'));

  constructor() {
    this.store.loadResidentsByNursingHome(this.nursingHomeId);
    this.store.loadRoomsByNursingHome(this.nursingHomeId);
  }

  selectedId: number | null = null;
  searchTerm = signal('');
  filteredPersonProfilesIds = signal<number[]>([]);
  residents = computed(() => this.store.residents());
  rooms = computed(() => this.store.rooms());

  onFiltered(ids: number[]) {
    this.filteredPersonProfilesIds.set(ids);
  }

  roomNumberById(id: number): string {
    const room = this.rooms().find(r => r.id === id);
    return room ? room.roomNumber : 'N/A';
  }

  filteredResidents = computed(() => {
    const ids = this.filteredPersonProfilesIds();
    const allResidents = this.residents();
    const term = this.searchTerm();

    if (!term) {
      return allResidents;
    }

    return allResidents.filter(r => ids.includes(r.personProfileId));
  });

  selectResident(id: number) {
    this.selectedId = this.selectedId === id ? null : id;
  }

  assignRoom(id: number) {
    void this.router.navigate(nursingNav.assignRoom(id));
  }

  viewDetails(id: number) {
    void this.router.navigate(nursingNav.residentDetail(id));
  }

  viewMedications(id: number) {
    void this.router.navigate(nursingNav.medications(id));
  }

  editResident(id: number) {
    void this.router.navigate(nursingNav.residentEdit(id));
    if (this.selectedId === id) {
      this.selectedId = null;
    }
  }

  navigateToNew(){
    void this.router.navigate(nursingNav.residentNew());
  }
}
