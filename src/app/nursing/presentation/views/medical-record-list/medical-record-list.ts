import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { LayoutNursingHome } from '../../../../shared/presentation/components/layout-nursing-home/layout-nursing-home';
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

import { AllergiesApiService } from '../../../../healt/infrastructure/allergies-api.service';
import { VitalSignsApiService } from '../../../../healt/infrastructure/vital-signs-api.service';
import { Allergy } from '../../../../healt/domain/model/allergy.entity';
import { VitalSign } from '../../../../healt/domain/model/vital-sign.entity';

interface AllergyTableRow {
  id: number;
  residentId: number;
  allergenName: string;
  reaction: string;
  severityLevel: string;
  typeOfAllergy: string;
}

interface VitalSignTableRow {
  id: number;
  residentId: number;
  measurementId: number;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  respiratoryRate: number;
  registeredAt: string;
  severityLevel: string;
}

@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [
    LayoutNursingHome,
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
  protected router = inject(Router);
  private route = inject(ActivatedRoute);
  private allergiesApiService = inject(AllergiesApiService);
  private vitalSignsApiService = inject(VitalSignsApiService);

  @ViewChild('allergyPaginator') allergyPaginator!: MatPaginator;
  @ViewChild('vitalSignsPaginator') vitalSignsPaginator!: MatPaginator;

  displayedColumns: string[] = [
    'allergenName',
    'reaction',
    'severityLevel',
    'typeOfAllergy'
  ];

  vitalSignsColumns: string[] = [
    'measurementId',
    'temperature',
    'heartRate',
    'bloodPressure',
    'oxygenSaturation',
    'respiratoryRate',
    'registeredAt',
    'severityLevel'
  ];

  residentId = signal<number | null>(null);

  loading = signal(false);
  errorMessage = signal('');

  allergies = signal<AllergyTableRow[]>([]);
  vitalSigns = signal<VitalSignTableRow[]>([]);

  searchTerm = signal('');
  selectedColumn = signal<string>('allergenName');
  sortDirection = signal<'asc' | 'desc'>('asc');

  vitalSignsSearchTerm = signal('');
  vitalSignsSelectedColumn = signal<string>('measurementId');
  vitalSignsSortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId.set(id);

      if (!id) {
        this.router.navigate(['/nursing/residents']).then();
        return;
      }

      this.loadHealthInformation(id);
    });
  }

  private loadHealthInformation(residentId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.loadAllergiesFromHealt(residentId);
    this.loadVitalSignsFromHealt(residentId);
  }

  private loadAllergiesFromHealt(residentId: number): void {
    this.allergiesApiService.getAllergiesByResidentId(residentId).subscribe({
      next: (allergies: Allergy[]) => {
        this.allergies.set(allergies.map(allergy => this.mapAllergyToTableRow(allergy)));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load allergies from Healt bounded context.');
        this.loading.set(false);
      }
    });
  }

  private loadVitalSignsFromHealt(residentId: number): void {
    this.vitalSignsApiService.getVitalSignsByResidentId(residentId).subscribe({
      next: (vitalSigns: VitalSign[]) => {
        this.vitalSigns.set(vitalSigns.map(vitalSign => this.mapVitalSignToTableRow(vitalSign)));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load vital signs from Healt bounded context.');
        this.loading.set(false);
      }
    });
  }

  private mapAllergyToTableRow(allergy: Allergy): AllergyTableRow {
    const rawAllergy = allergy as any;

    return {
      id: rawAllergy.id,
      residentId: rawAllergy.residentId,
      allergenName: rawAllergy.allergenName ?? rawAllergy.allergen ?? '',
      reaction: rawAllergy.reaction ?? '',
      severityLevel: rawAllergy.severityLevel ?? rawAllergy.severity ?? '',
      typeOfAllergy: rawAllergy.typeOfAllergy ?? rawAllergy.type ?? 'Medical'
    };
  }

  private mapVitalSignToTableRow(vitalSign: VitalSign): VitalSignTableRow {
    const rawVitalSign = vitalSign as any;

    return {
      id: rawVitalSign.id,
      residentId: rawVitalSign.residentId,
      measurementId: rawVitalSign.measurementId ?? rawVitalSign.id,
      temperature: rawVitalSign.temperature ?? 0,
      heartRate: rawVitalSign.heartRate ?? 0,
      bloodPressure: rawVitalSign.bloodPressure ?? '',
      oxygenSaturation: rawVitalSign.oxygenSaturation ?? 0,
      respiratoryRate: rawVitalSign.respiratoryRate ?? 0,
      registeredAt: rawVitalSign.registeredAt ?? '',
      severityLevel: rawVitalSign.severityLevel ?? rawVitalSign.status ?? ''
    };
  }

  filteredAllergies = computed(() => {
    const term = this.removeAccents(this.searchTerm().toLowerCase().trim());
    const residentId = this.residentId();
    const col = this.selectedColumn();
    const dir = this.sortDirection();

    let result = this.allergies().filter(allergy => allergy.residentId === residentId);

    if (term) {
      result = result.filter(allergy => {
        const name = this.removeAccents(allergy.allergenName?.toLowerCase() || '');
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

  filteredVitalSigns = computed(() => {
    const term = this.vitalSignsSearchTerm().toLowerCase().trim();
    const residentId = this.residentId();
    const col = this.vitalSignsSelectedColumn();
    const dir = this.vitalSignsSortDirection();

    let result = this.vitalSigns().filter(sign => sign.residentId === residentId);

    if (term) {
      result = result.filter(sign => {
        const id = sign.measurementId?.toString() || '';
        const severity = sign.severityLevel?.toLowerCase() || '';
        const temperature = sign.temperature?.toString() || '';
        const heartRate = sign.heartRate?.toString() || '';
        const bloodPressure = sign.bloodPressure?.toLowerCase() || '';
        const oxygenSaturation = sign.oxygenSaturation?.toString() || '';
        const respiratoryRate = sign.respiratoryRate?.toString() || '';
        const registeredAt = sign.registeredAt?.toLowerCase() || '';

        return id.includes(term)
          || severity.includes(term)
          || temperature.includes(term)
          || heartRate.includes(term)
          || bloodPressure.includes(term)
          || oxygenSaturation.includes(term)
          || respiratoryRate.includes(term)
          || registeredAt.includes(term);
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

  toggleVitalSignsSort(col: string): void {
    if (this.vitalSignsSelectedColumn() === col) {
      this.vitalSignsSortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.vitalSignsSelectedColumn.set(col);
      this.vitalSignsSortDirection.set('asc');
    }
  }

  navigateToNew(id: number): void {
    this.router.navigate(['/nursing/residents', id, 'allergies', 'new']).then();
  }

  navigateToNewVitalSign(id: number): void {
    this.router.navigate(['/nursing/residents', id, 'vital-signs', 'new']).then();
  }

  goBack(): void {
    const id = this.residentId();

    if (id) {
      this.router.navigate(['/nursing/residents', id, 'show']).then();
      return;
    }

    this.router.navigate(['/nursing/residents']).then();
  }
}
