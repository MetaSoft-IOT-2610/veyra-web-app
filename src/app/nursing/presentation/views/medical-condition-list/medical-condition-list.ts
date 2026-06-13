import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInput } from '@angular/material/input';

import { NursingStore } from '../../../application/nursing.store';
import { nursingNav } from '../../nursing-routes';

/**
 * @purpose: List page for resident medical conditions.
 * @description: This standalone component displays, filters and sorts medical conditions associated with a resident.
 */
@Component({
  selector: 'app-medical-condition-list',
  standalone: true,
  imports: [
    TranslatePipe,
    MatProgressSpinner,
    MatError,
    MatIcon,
    MatIconButton,
    MatButton,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSuffix
  ],
  templateUrl: './medical-condition-list.html',
  styleUrl: './medical-condition-list.css'
})
export class MedicalConditionList {
  readonly store = inject(NursingStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'diagnosisName',
    'diagnosisDate',
    'status',
    'notes'
  ];

  residentId = signal<number | null>(null);
  searchTerm = signal('');
  selectedColumn = signal<string>('diagnosisName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId.set(id);

      if (!id) {
        void this.router.navigate(nursingNav.residents());
        return;
      }

      this.store.loadMedicalConditions(id);
    });
  }

  filteredMedicalConditions = computed(() => {
    const term = this.removeAccents(this.searchTerm().toLowerCase().trim());

    const conditions = this.store.medicalConditions()
      .filter(condition => condition.residentId === this.residentId());

    const col = this.selectedColumn();
    const dir = this.sortDirection();

    let result = conditions;

    if (term) {
      result = conditions.filter(condition => {
        const name = this.removeAccents(condition.diagnosisName?.toLowerCase() || '');
        return name.startsWith(term);
      });
    }

    return [...result].sort((a, b) => {
      let valA = (a as any)[col];
      let valB = (b as any)[col];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      return dir === 'asc'
        ? valA > valB ? 1 : -1
        : valA < valB ? 1 : -1;
    });
  });

  removeAccents(word: string): string {
    return word.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
  }

  toggleSort(col: string): void {
    if (this.selectedColumn() === col) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.selectedColumn.set(col);
      this.sortDirection.set('asc');
    }
  }

  navigateToNew(id: number): void {
    void this.router.navigate(nursingNav.medicalConditionNew(id));
  }

  goBack(): void {
    const id = this.residentId();

    if (id) {
      void this.router.navigate(nursingNav.medicalRecords(id));
      return;
    }

    void this.router.navigate(nursingNav.residents());
  }
}
