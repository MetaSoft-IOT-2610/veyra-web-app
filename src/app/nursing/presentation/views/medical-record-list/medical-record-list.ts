import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { NursingStore } from '../../../application/nursing.store';
import { ActivatedRoute, Router } from '@angular/router';
import { nursingNav } from '../../nursing-routes';
import { MatPaginator } from '@angular/material/paginator';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatError, MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-medical-record-list',
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatError,
    MatFormField,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatPaginator,
    MatPrefix,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSuffix,
    MatTable,
    MatNoDataRow,
    TranslatePipe
  ],
  templateUrl: './medical-record-list.html',
  styleUrl: './medical-record-list.css'
})
export class MedicalRecordList {
  readonly store = inject(NursingStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('allergyPaginator') allergyPaginator!: MatPaginator;
  @ViewChild('medicalConditionPaginator') medicalConditionPaginator!: MatPaginator;
  @ViewChild('vitalSignsPaginator') vitalSignsPaginator!: MatPaginator;

  displayedColumns: string[] = [
    'allergenName',
    'reaction',
    'severityLevel',
    'typeOfAllergy'
  ];

  medicalConditionColumns: string[] = [
    'diagnosisName',
    'diagnosisDate',
    'status',
    'notes'
  ];

  vitalSignsColumns: string[] = [
    'measurementId',
    'severityLevel'
  ];

  residentId = signal<number | null>(null);

  loading = signal(false);
  errorMessage = signal('');

  searchTerm = signal('');
  selectedColumn = signal<string>('allergenName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  medicalConditionSearchTerm = signal('');
  medicalConditionSelectedColumn = signal<string>('diagnosisName');
  medicalConditionSortDirection = signal<'asc' | 'desc'>('asc');

  vitalSignsSearchTerm = signal('');
  vitalSignsSelectedColumn = signal<string>('measurementId');
  vitalSignsSortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId.set(id);

      if (!id) {
        void this.router.navigate(nursingNav.residents());
        return;
      }

      this.loadMedicalRecord(id);
    });
  }

  private loadMedicalRecord(residentId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.store.loadAllergies(residentId);
    this.store.loadMedicalConditions(residentId);
    this.store.loadVitalSigns(residentId);

    this.loading.set(false);
  }

  filteredAllergies = computed(() => {
    const term = this.removeAccents(this.searchTerm().toLowerCase().trim());
    const allergies = this.store.allergies().filter(allergy => allergy.residentId === this.residentId());

    let result = allergies;

    if (term) {
      result = allergies.filter(allergy => {
        const name = this.removeAccents(allergy.allergenName?.toLowerCase() || '');
        return name.startsWith(term);
      });
    }

    return this.sortResult(result, this.selectedColumn(), this.sortDirection());
  });

  filteredMedicalConditions = computed(() => {
    const term = this.removeAccents(this.medicalConditionSearchTerm().toLowerCase().trim());
    const conditions = this.store.medicalConditions().filter(condition => condition.residentId === this.residentId());

    let result = conditions;

    if (term) {
      result = conditions.filter(condition => {
        const name = this.removeAccents(condition.diagnosisName?.toLowerCase() || '');
        return name.startsWith(term);
      });
    }

    return this.sortResult(result, this.medicalConditionSelectedColumn(), this.medicalConditionSortDirection());
  });

  filteredVitalSigns = computed(() => {
    const term = this.vitalSignsSearchTerm().toLowerCase().trim();
    const signs = this.store.vitalSigns().filter(sign => sign.residentId === this.residentId());

    let result = signs;

    if (term) {
      result = signs.filter(sign => {
        const id = sign.measurementId?.toString() || '';
        const severity = sign.severityLevel?.toLowerCase() || '';
        return id.includes(term) || severity.includes(term);
      });
    }

    return this.sortResult(result, this.vitalSignsSelectedColumn(), this.vitalSignsSortDirection());
  });

  private sortResult<T>(result: T[], col: string, dir: 'asc' | 'desc'): T[] {
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
  }

  removeAccents(word: string): string {
    return word.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
  }

  toggleSort(col: string): void {
    if (this.selectedColumn() === col) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.selectedColumn.set(col);
      this.sortDirection.set('asc');
    }
  }

  toggleMedicalConditionSort(col: string): void {
    if (this.medicalConditionSelectedColumn() === col) {
      this.medicalConditionSortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.medicalConditionSelectedColumn.set(col);
      this.medicalConditionSortDirection.set('asc');
    }
  }

  toggleVitalSignsSort(col: string): void {
    if (this.vitalSignsSelectedColumn() === col) {
      this.vitalSignsSortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.vitalSignsSelectedColumn.set(col);
      this.vitalSignsSortDirection.set('asc');
    }
  }

  navigateToNew(id: number): void {
    void this.router.navigate(nursingNav.allergyNew(id));
  }

  navigateToNewMedicalCondition(id: number): void {
    void this.router.navigate(nursingNav.medicalConditionNew(id));
  }

  navigateToNewVitalSign(id: number): void {
    void this.router.navigate(['nursing/residents', id, 'vital-signs', 'new']);
  }

  goBack(): void {
    const id = this.residentId();

    if (id) {
      void this.router.navigate(nursingNav.residentDetail(id));
    }
  }
}
