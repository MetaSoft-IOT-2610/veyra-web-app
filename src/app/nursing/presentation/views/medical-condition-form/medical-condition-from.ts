import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatCalendar } from '@angular/material/datepicker';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatSelect } from '@angular/material/select';

import { NursingStore } from '../../../application/nursing.store';
import { CreateMedicalConditionCommand } from '../../../domain/model/create-medical-condition.command';
import { nursingNav } from '../../nursing-routes';

/**
 * @purpose: Form page for creating a medical condition.
 * @description: This standalone component allows registering a resident medical condition.
 */
@Component({
  selector: 'app-medical-condition-form',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    DatePipe,
    MatButton,
    MatCalendar,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    MatIcon,
    MatCard,
    MatSelect,
    MatOption
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './medical-condition-form.html',
  styleUrl: './medical-condition-form.css'
})
export class MedicalConditionForm {
  private fb = inject(FormBuilder);
  protected store = inject(NursingStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  residentId: number | null = null;

  maxDiagnosisDate = new Date();
  startDate = new Date();

  form = this.fb.group({
    diagnosisName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    diagnosisDate: new FormControl<Date | null>(null, {
      validators: [Validators.required]
    }),
    status: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    notes: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.residentId = id;

      if (!id) {
        void this.router.navigate(nursingNav.residents());
      }
    });
  }

  /**
   * Updates the selected diagnosis date in the form.
   * @param date - Selected date from the calendar.
   */
  onDiagnosisDateSelected(date: Date | null): void {
    this.form.patchValue({ diagnosisDate: date });
    this.form.get('diagnosisDate')?.markAsTouched();
  }

  /**
   * Submits the form and creates a medical condition for the selected resident.
   */
  submit(): void {
    if (this.form.invalid) {
      alert('Datos incompletos');
      this.form.markAllAsTouched();
      return;
    }

    if (!this.residentId) {
      alert('No se encontró el residente');
      return;
    }

    const formValue = this.form.getRawValue();

    const command = new CreateMedicalConditionCommand({
      diagnosisName: formValue.diagnosisName.trim(),
      diagnosisDate: this.formatDateToISO(formValue.diagnosisDate!),
      status: formValue.status,
      notes: formValue.notes.trim()
    });

    console.log('FORM VALUE:', formValue);
    console.log('COMMAND TO SEND:', command);

    this.store.addMedicalCondition(this.residentId, command).subscribe({
      next: createdMedicalCondition => {
        console.log('CREATED MEDICAL CONDITION:', createdMedicalCondition);
        void this.router.navigate(nursingNav.medicalRecords(this.residentId!));
      },
      error: err => {
        console.error('FULL ERROR medical condition:', err);
        console.error('STATUS:', err?.status);
        console.error('ERROR BODY:', err?.error);
        alert(`No se pudo registrar la condición médica. Status: ${err?.status}`);
      }
    });
  }

  /**
   * Cancels the creation flow and returns to the resident medical records list.
   */
  onCancel(): void {
    if (this.residentId) {
      void this.router.navigate(nursingNav.medicalRecords(this.residentId));
      return;
    }

    void this.router.navigate(nursingNav.residents());
  }

  /**
   * Converts a Date object into ISO date format yyyy-MM-dd.
   * @param date - Date object selected by the user.
   * @returns Formatted date string.
   */
  private formatDateToISO(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
