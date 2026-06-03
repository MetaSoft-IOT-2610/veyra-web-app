import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingStore } from '../../../application/tracking.store';
import { DeviceType } from '../../../domain/model/device-type.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateDeviceCommand } from '../../../domain/model/create-device.command';
import { UpdateDeviceCommand } from '../../../domain/model/update-device.command';
import { trackingNav } from '../../tracking-routes';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-device-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe,
    MatInput,
  ],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css'
})
export class DeviceForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(TrackingStore);

  deviceTypes = Object.values(DeviceType);

  form = this.fb.group({
    deviceType: new FormControl<DeviceType | null>(null, { validators: [Validators.required] }),
    macAddress: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
      ]
    })
  });

  isEdit = false;
  deviceId: number | null = null;
  nursingHomeId: number = 0;

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));

    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.deviceId;

      if (this.isEdit && this.deviceId) {
        const device = this.store.getDeviceById(this.deviceId)();
        if (device) {
          this.form.patchValue({
            deviceType: device.deviceType as DeviceType,
            macAddress: device.macAddress
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    if (this.isEdit && this.deviceId) {
      const command = new UpdateDeviceCommand({
        id: this.deviceId,
        deviceType: this.form.value.deviceType!,
        macAddress: this.form.value.macAddress!
      });
      this.store.updateDevice(command);
    } else {
      const command = new CreateDeviceCommand({
        nursingHomeId: this.nursingHomeId,
        deviceType: this.form.value.deviceType!,
        macAddress: this.form.value.macAddress!
      });
      this.store.addDevice(this.nursingHomeId, command);
    }

    this.router.navigate(trackingNav.devices()).then();
  }
}
