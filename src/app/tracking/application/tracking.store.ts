import {computed, Injectable, Signal, signal} from '@angular/core';
import {Device} from '../domain/model/device.entity';
import {DeviceStatus} from '../domain/model/device-status.enum';
import {TrackingApi} from '../infrastructure/tracking-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CreateDeviceCommand} from '../domain/model/create-device.command';
import {DeviceResource} from '../infrastructure/devices-response';
import {retry} from 'rxjs';
import {UpdateDeviceCommand} from '../domain/model/update-device.command';
import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {ChangeDeviceStatusCommand} from '../domain/model/change-device-status.command';

@Injectable({ providedIn: 'root' })
export class TrackingStore {

  private readonly deviceSignal = signal<Device[]>([]);
  readonly devices = this.deviceSignal.asReadonly();
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly totalDevices = computed(() => this.devices().length);
  readonly availableDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.AVAILABLE).length
  );
  readonly assignedDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.ASSIGNED).length
  );
  readonly disabledDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.DISABLED).length
  );

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
        },
        error: err => {
          this.loadingSignal.set(false);
          this.errorSignal.set(this.formatError(err, 'Failed to load devices'));
        }
      });
  }

  addDevice(command: CreateDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.createDevice(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        // convierte DeviceResource → Device para el store
        const device = new Device({
          id: resource.id,
          nursingHomeId: resource.nursingHomeId,
          deviceType: resource.deviceType,
          status: resource.status,
          macAddress: resource.macAddress,
          residentId: resource.residentId,
          lastSync: resource.lastSync
        });
        this.deviceSignal.update(list => [...list, device]);
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to add device'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateDevice(command: UpdateDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.updateDevice(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === resource.id
            ? new Device({
              id: resource.id,
              nursingHomeId: resource.nursingHomeId,
              deviceType: resource.deviceType,
              status: resource.status,
              macAddress: resource.macAddress,
              residentId: resource.residentId,
              lastSync: resource.lastSync
            })
            : d
          )
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update device'));
        this.loadingSignal.set(false);
      }
    });
  }

  assignDevice(command: AssignDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.assignDevice(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === resource.id
            ? new Device({
              id: resource.id,
              nursingHomeId: resource.nursingHomeId,
              deviceType: resource.deviceType,
              status: resource.status,
              macAddress: resource.macAddress,
              residentId: resource.residentId,
              lastSync: resource.lastSync
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

  unassignDevice(deviceId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.unassignDevice(deviceId).pipe(retry(2)).subscribe({
      next: () => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === deviceId
            ? new Device({
              id: d.id,
              nursingHomeId: d.nursingHomeId,
              deviceType: d.deviceType,
              macAddress: d.macAddress,
              lastSync: d.lastSync,
              residentId: null,
              status: DeviceStatus.AVAILABLE,
            })
            : d
          )
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to unassign device'));
        this.loadingSignal.set(false);
      }
    });
  }

  changeDeviceStatus(command: ChangeDeviceStatusCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.changeStatusDevice(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === resource.id
            ? new Device({
              id: resource.id,
              nursingHomeId: resource.nursingHomeId,
              deviceType: resource.deviceType,
              status: resource.status,
              macAddress: resource.macAddress,
              residentId: resource.residentId,
              lastSync: resource.lastSync
            })
            : d
          )
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to change device status'));
        this.loadingSignal.set(false);
      }
    });
  }

  getDeviceById(id: number): Signal<Device | undefined> {
    return computed(() => id ? this.devices().find(d => d.id === id) : undefined);
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
