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

import { Relative } from '../../../domain/model/relative.entity';
import { CreateRelativeCommand } from '../../../domain/model/create-relative.command';
import {TranslatePipe} from '@ngx-translate/core';

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

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef?: MatDialogRef<RelativeDetail>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Relative
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.form.patchValue({
        firstName: source.firstName,
        lastName: source.lastName,
        email: source.email
      });
      this.editing.set(false);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.form.patchValue({
        firstName: source.firstName,
        lastName: source.lastName,
        email: source.email
      });
      this.editing.set(false);
    }
  }

  startEdit(): void {
    this.editing.set(true);
  }

  cancelEdit(): void {
    const source = this.data ?? this.relative;
    if (source) {
      this.form.patchValue({
        firstName: source.firstName,
        lastName: source.lastName,
        email: source.email
      });
    }
    this.editing.set(false);
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

    const source = this.data ?? this.relative;

    const command = new CreateRelativeCommand({
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      residentId: source?.residentId ?? 0
    });
    if (this.dialogRef) {
      this.dialogRef.close(command);
      return;
    }

    this.save.emit(command);
    this.editing.set(false);

  }
}
