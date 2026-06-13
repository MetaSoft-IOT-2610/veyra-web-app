import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject,
  Optional,
  signal,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { Relative } from '../../../domain/model/relative.entity';
import { CreateRelativeCommand } from '../../../domain/model/create-relative.command';
import { NursingStore } from '../../../application/nursing.store';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';
import { Resident } from '../../../domain/model/resident.entity';
import { PersonProfile } from '../../../../profiles/domain/model/person-profile.entity';

export interface ResidentWithProfile {
  resident: Resident;
  profile: PersonProfile | undefined;
}

@Component({
  selector: 'app-relative-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './relative-detail.html',
  styleUrls: ['./relative-detail.css']
})
export class RelativeDetail implements OnChanges, OnInit {
  @Input() relative?: Relative | null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateRelativeCommand>();

  editing = signal(false);
  form: FormGroup;

  // Inyección de Stores
  private readonly nursingStore = inject(NursingStore);
  private readonly profilesStore = inject(ProfilesStore);
  selectedResidentId = signal<number | null>(null);

  // Modifica el selectedEntry actual por este:
  readonly selectedEntry = computed<ResidentWithProfile | null>(() => {
    const currentResidentId = this.selectedResidentId(); // Reaccionará a los cambios de esta señal
    return this.residentsWithProfiles().find(r => r.resident.id === currentResidentId) || null;
  });

  // Lista calculada de residentes con sus perfiles
  readonly residentsWithProfiles = computed<ResidentWithProfile[]>(() =>
    this.nursingStore.residents().map(resident => ({
      resident,
      profile: this.profilesStore.personProfiles().find(p => p.id === resident.personProfileId)
    }))
  );


  readonly showResidentDropdown = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef?: MatDialogRef<RelativeDetail>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Relative
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      relative: [null, Validators.required],
    });

    // Cargar datos al instanciar
    const nursingHomeId = localStorage.getItem('nursingHomeId');
    if (nursingHomeId) {
      this.nursingStore.loadResidentsByNursingHome(Number(nursingHomeId));
    }
    this.profilesStore.loadPersonProfiles();
  }

  ngOnInit(): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.patchForm(source);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.patchForm(source);
    }
  }

  private patchForm(source: Relative): void {
    this.form.patchValue({
      firstName: source.firstName,
      lastName: source.lastName,
      email: source.email,
      relative: source.residentId
    });

    // Añade esta línea para sincronizar la señal
    this.selectedResidentId.set(source.residentId);

    this.editing.set(false);
  }

  startEdit(): void {
    this.editing.set(true);
  }

  cancelEdit(): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.patchForm(source);
    }
    this.editing.set(false);
    this.showResidentDropdown.set(false);
  }

  toggleResidentDropdown(): void {
    this.showResidentDropdown.update(v => !v);
  }

  selectEntry(entry: ResidentWithProfile): void {
    this.form.patchValue({ relative: entry.resident.id });

    // Añade esta línea para actualizar la UI instantáneamente
    this.selectedResidentId.set(entry.resident.id);

    this.showResidentDropdown.set(false);
  }

  onClose(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    this.close.emit();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command = new CreateRelativeCommand({
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      residentId: this.form.value.relative
    });

    if (this.dialogRef) {
      this.dialogRef.close(command);
      return;
    }

    this.save.emit(command);
    this.editing.set(false);
    this.showResidentDropdown.set(false);
  }
}
