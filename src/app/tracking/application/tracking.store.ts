import { computed, Injectable, signal } from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrackingApi } from '../infrastructure/tracking-api';
import { Device } from '../domain/model/device.entity';
import { CreateDeviceCommand } from '../domain/model/create-device.command';

@Injectable({ providedIn: 'root' })
export class TrackingStore {
  private readonly _devicesSignal = signal<Device[]>([]);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly devices = this._devicesSignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  constructor(private trackingApi: TrackingApi) {}

  loadDevices(nursingHomeId: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.trackingApi.getDevices(nursingHomeId).pipe(takeUntilDestroyed()).subscribe({
      next: devices => {
        this._devicesSignal.set(devices);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to load devices'));
        this._loadingSignal.set(false);
      }
    });
  }

  addDevice(nursingHomeId: number, command: CreateDeviceCommand): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.trackingApi.createDevice(nursingHomeId, command).pipe(retry(2)).subscribe({
      next: created => {
        this._devicesSignal.update(devices => [...devices, created]);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to create device'));
        this._loadingSignal.set(false);
      }
    });
  }

  editDevice(id: number, command: CreateDeviceCommand): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.trackingApi.updateDevice(id, command).pipe(retry(2)).subscribe({
      next: updated => {
        this._devicesSignal.update(devices =>
          devices.map(d => d.id === updated.id ? updated : d)
        );
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to update device'));
        this._loadingSignal.set(false);
      }
    });
  }

  removeDevice(id: number): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.trackingApi.deleteDevice(id).pipe(retry(2)).subscribe({
      next: () => {
        this._devicesSignal.update(devices => devices.filter(d => d.id !== id));
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to delete device'));
        this._loadingSignal.set(false);
      }
    });
  }

  getDeviceById(id: number) {
    return computed(() => this._devicesSignal().find(d => d.id === id));
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
