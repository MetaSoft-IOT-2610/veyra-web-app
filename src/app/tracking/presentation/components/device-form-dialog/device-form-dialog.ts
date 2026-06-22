import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { TrackingStore } from '../../../application/tracking.store';
import { DeviceType } from '../../../domain/model/device-type.enum';
import { CreateDeviceCommand } from '../../../domain/model/create-device.command';
import { UpdateDeviceCommand } from '../../../domain/model/update-device.command';
import { Device } from '../../../domain/model/device.entity';
import { isEdgeGateway } from '../../../domain/model/device-type.helpers';

export type DeviceFormDialogMode = 'create' | 'edit';

export interface DeviceFormDialogData {
  mode: DeviceFormDialogMode;
  nursingHomeId: number;
  device?: Device;
}

@Component({
  selector: 'app-device-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    TranslatePipe,
  ],
  templateUrl: './device-form-dialog.html',
  styleUrl: './device-form-dialog.css',
})
export class DeviceFormDialog {
  readonly data = inject<DeviceFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeviceFormDialog>);
  private readonly fb = inject(FormBuilder);
  readonly store = inject(TrackingStore);

  readonly isEdit = this.data.mode === 'edit';
  readonly isEdgeGateway = isEdgeGateway;
  readonly allDeviceTypes = Object.values(DeviceType);

  form = this.fb.group({
    externalDeviceId: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$')
      ]
    }),
    deviceType: new FormControl<DeviceType | null>(null, { validators: [Validators.required] }),
    macAddress: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
      ]
    })
  });

  availableDeviceTypes = computed(() => {
    const gateway = this.store.gatewayDevice();
    if (this.isEdit || !gateway) {
      return this.allDeviceTypes;
    }
    return this.allDeviceTypes.filter(t => t !== DeviceType.EDGE_GATEWAY);
  });

  selectedTypeHint = computed(() => {
    const type = this.form.get('deviceType')?.value;
    if (type === DeviceType.EDGE_GATEWAY) return 'tracking.devices.form.gateway-hint';
    if (type === DeviceType.VITAL_SIGNS) return 'tracking.devices.form.node-hint';
    if (type === DeviceType.GPS) return 'tracking.devices.form.gps-hint';
    return 'tracking.devices.form.external-id-hint';
  });

  constructor() {
    if (this.isEdit && this.data.device) {
      this.form.patchValue({
        externalDeviceId: this.data.device.externalDeviceId,
        deviceType: this.data.device.deviceType as DeviceType,
        macAddress: this.data.device.macAddress
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEdit && this.data.device) {
      this.store.updateDevice(new UpdateDeviceCommand({
        deviceId: this.data.device.id,
        externalDeviceId: this.form.value.externalDeviceId!,
        deviceType: this.form.value.deviceType!,
        macAddress: this.form.value.macAddress!
      }));
    } else {
      this.store.addDevice(new CreateDeviceCommand({
        nursingHomeId: this.data.nursingHomeId,
        externalDeviceId: this.form.value.externalDeviceId!,
        deviceType: this.form.value.deviceType!,
        macAddress: this.form.value.macAddress!
      }));
    }

    this.dialogRef.close(true);
  }
}
