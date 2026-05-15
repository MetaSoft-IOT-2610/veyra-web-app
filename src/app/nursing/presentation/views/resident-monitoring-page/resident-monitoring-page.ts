import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {NursingStore} from '../../../application/nursing.store';

/**
 * Flattened row combining MonitoringResidents (nursing BC)
 * + VitalSign data (health BC).
 * Fields from health BC are optional until the second call resolves.
 */
export interface ResidentMonitoringRow {
  residentId: number;
  doctorId: number;
  healthId: number;
  firstName: string;
  lastName: string;
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
export class ResidentMonitoringPage implements OnInit {

  private readonly nursingStore = inject(NursingStore);
  private readonly router = inject(Router);

  readonly displayedColumns = [
    'name', 'lastName', 'room', 'status',
    'heartRate', 'temperature', 'oxygen', 'actions'
  ];

  readonly loading = this.nursingStore.loading;
  readonly error   = this.nursingStore.error;

  /**
   * Signal that holds the combined rows (nursing + health BC).
   * Populated in ngOnInit once both calls resolve.
   * Replace the mock data with real combined data when health BC is ready.
   */
  readonly rows = signal<ResidentMonitoringRow[]>([]);

  readonly currentPage = signal(1);
  readonly totalItems  = computed(() => this.rows().length);
  readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.totalItems() / PAGE_SIZE)));
  readonly pages       = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly startIndex  = computed(() => (this.currentPage() - 1) * PAGE_SIZE);
  readonly endIndex    = computed(() => Math.min(this.startIndex() + PAGE_SIZE, this.totalItems()));
  readonly pagedRows   = computed(() => this.rows().slice(this.startIndex(), this.endIndex()));


  ngOnInit(): void {
    const nursingHomeId = Number(localStorage.getItem('nursingHomeId'));
    const doctorId      = Number(localStorage.getItem('doctorId'));

    this.nursingStore.loadMonitoringResidentsByDoctor(nursingHomeId, doctorId);
  }


  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }


  onSeeResident(residentId: number): void {
    this.router.navigate(['/nursing/residents', residentId, 'show']);
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
