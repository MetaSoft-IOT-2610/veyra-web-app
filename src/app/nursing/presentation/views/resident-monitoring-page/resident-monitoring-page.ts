import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { nursingNav } from '../../nursing-routes';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NursingStore } from '../../../application/nursing.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';

export interface ResidentMonitoringRow {
  residentId: number;
  doctorId?: number;
  healthId?: number;
  fullName: string;
  roomNumber: string | null;
  status: 'Stable' | 'Critical' | 'Observation' | null;
  heartRate: number | null;
  temperature: number | null;
  oxygenLevel: number | null;
}

const PAGE_SIZE = 4;

@Component({
  selector: 'app-resident-monitoring-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgClass,
  ],
  templateUrl: './resident-monitoring-page.html',
  styleUrl: './resident-monitoring-page.css'
})
export class ResidentMonitoringPage {

  private readonly nursingStore  = inject(NursingStore);
  private readonly profilesStore = inject(ProfilesStore);
  private readonly router        = inject(Router);

  readonly displayedColumns = [
    'fullName', 'room', 'status',
    'heartRate', 'temperature', 'oxygen', 'actions'
  ];

  // Unificamos el estado de carga de ambos stores para evitar inconsistencias
  readonly loading = computed(() => this.nursingStore.loading() || this.profilesStore.loading());
  readonly error   = this.nursingStore.error;

  readonly currentPage = signal(1);

  constructor() {
    const nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
    this.nursingStore.loadResidentsByNursingHome(nursingHomeId);
    this.nursingStore.loadRoomsByNursingHome(nursingHomeId);
    this.profilesStore.loadPersonProfiles();
  }

  readonly rows = computed<ResidentMonitoringRow[]>(() => {
    const residents  = this.nursingStore.residents();
    const rooms      = this.nursingStore.rooms();
    const profiles   = this.profilesStore.personProfiles();

    // Si no hay residentes cargados, devolvemos lista vacía para no bloquear la UI
    if (residents.length === 0) return [];

    return residents.map(resident => {
      const room = rooms.find(r => r.id === resident?.roomId);
      const profile = profiles.find(p => p.id === resident?.personProfileId);

      return {
        residentId: resident.id,
        // Usamos firstName y lastName como solicitaste
        fullName:   profile ? `${profile.fullName}` : 'Loading...',
        roomNumber: room?.roomNumber  ?? null,
        status:     null,
        heartRate:  null,
        temperature: null,
        oxygenLevel: null,
      };
    });
  });

  readonly totalItems  = computed(() => this.rows().length);
  readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.totalItems() / PAGE_SIZE)));
  readonly pages       = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly startIndex  = computed(() => (this.currentPage() - 1) * PAGE_SIZE);
  readonly endIndex    = computed(() => Math.min(this.startIndex() + PAGE_SIZE, this.totalItems()));
  readonly pagedRows   = computed(() => this.rows().slice(this.startIndex(), this.endIndex()));

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  onSeeResident(residentId: number): void {
    void this.router.navigate(nursingNav.residentDetail(residentId));
  }

  getStatusClass(status: string | null): string {
    const map: Record<string, string> = {
      'Stable':      'status-stable',
      'Critical':    'status-critical',
      'Observation': 'status-observation',
    };
    return status ? (map[status] ?? '') : '';
  }

  getHeartRateClass(bpm: number): string {
    if (bpm > 100 || bpm < 50) return 'vital-danger';
    if (bpm >= 50 && bpm < 60)  return 'vital-warning';
    return 'vital-normal';
  }

  getOxygenClass(o2: number): string {
    if (o2 >= 97) return 'vital-normal';
    if (o2 >= 90) return 'vital-warning';
    return 'vital-danger';
  }
}
