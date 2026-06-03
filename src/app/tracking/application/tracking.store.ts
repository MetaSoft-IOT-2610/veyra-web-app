import { computed, Injectable, Signal, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrackingApi } from '../infrastructure/tracking-api';
import { Device } from '../domain/model/device.entity';
import { CreateDeviceCommand } from '../domain/model/create-device.command';
import { AssignDeviceCommand } from '../domain/model/assign-device.command';
import { AssignDeviceResource } from '../infrastructure/assign-device-response';
import { DeviceStatus } from '../domain/model/device-status.enum';
import {UpdateDeviceCommand} from '../domain/model/update-device.command';

@Injectable({ providedIn: 'root' })
export class TrackingStore {

  private readonly deviceSignal = signal<Device[]>([]);
  readonly devices = this.deviceSignal.asReadonly();
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();
  private readonly _successMsg = signal<string | null>(null);

  constructor(private trackingApi: TrackingApi) {}

  loadDevices(nursingHomeId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.getDevices(nursingHomeId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: devices => {
          this.deviceSignal.set(devices);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: err => {
          this.loadingSignal.set(false);
          this.errorSignal.set(this.formatError(err, 'Failed to load devices'));
        }
      });
  }

  addDevice(nursingHomeId: number, command: CreateDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.createDevice(nursingHomeId, command as any).pipe(retry(2)).subscribe({
      next: (device: Device) => {
        this.deviceSignal.update(list => [...list, device]);
        this._successMsg.set('Device added successfully');
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to add device'));
        this.loadingSignal.set(false);
      }
    });
  }

  assignDevice(deviceId: number, command: AssignDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.assignDevice(deviceId, command).pipe(retry(2)).subscribe({
      next: (resource: AssignDeviceResource) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === resource.deviceId
            ? new Device({
              id: d.id,
              nursingHomeId: d.nursingHomeId,
              deviceType: d.deviceType,
              macAddress: d.macAddress,
              residentId: resource.residentId,
              status: DeviceStatus.ASSIGNED
            })
            : d
          )
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to assign device'));
        this.loadingSignal.set(false);
      }
    });
  }

  disableDevice(id: number): void {
    this.deviceSignal.update(list =>
      list.map(d => d.id === id
        ? new Device({
          id: d.id,
          nursingHomeId: d.nursingHomeId,
          deviceType: d.deviceType,
          macAddress: d.macAddress,
          residentId: d.residentId,
          status: d.status === DeviceStatus.DISABLED
            ? DeviceStatus.AVAILABLE
            : DeviceStatus.DISABLED
        })
        : d
      )
    );
  }

  getDeviceById(id: number): Signal<Device | undefined> {
    return computed(() => id ? this.devices().find(d => d.id === id) : undefined);
  }
  updateDevice(command: UpdateDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.updateDevice(command.id, command).pipe(retry(2)).subscribe({
      next: (updatedDevice: Device) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === updatedDevice.id ? updatedDevice : d)
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update device'));
        this.loadingSignal.set(false);
      }
    });
  }
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
