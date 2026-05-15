import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateDeviceCommand } from '../../../domain/model/create-device.command';
import { DeviceType } from '../../../domain/model/device-type.enum';
import { Device } from '../../../domain/model/device.entity';

export interface RegisterDeviceDialogData {
  device?: Device;
}

@Component({
  selector: 'app-register-device-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './register-device-dialog.html',
  styleUrl: './register-device-dialog.css'
})
export class RegisterDeviceDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RegisterDeviceDialog>);

  readonly deviceTypes = Object.values(DeviceType);
  readonly isEdit: boolean;

  form = this.fb.group({
    deviceId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    deviceType: new FormControl<DeviceType | null>(null, { validators: [Validators.required] })
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: RegisterDeviceDialogData) {
    this.isEdit = !!data?.device;
    if (this.isEdit && data.device) {
      this.form.patchValue({
        deviceId: data.device.deviceId,
        deviceType: data.device.deviceType
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const { deviceId, deviceType } = this.form.getRawValue();
    const command = new CreateDeviceCommand({
      deviceId: deviceId,
      deviceType: deviceType as DeviceType
    });
    this.dialogRef.close(command);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
