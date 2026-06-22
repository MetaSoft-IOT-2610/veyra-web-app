import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
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
import {ChangeIotStatusCommand} from '../domain/model/change-iot-status.command';
import {Measurement} from '../domain/model/measurement.entity';
import {DeviceType} from '../domain/model/device-type.enum';

@Injectable({ providedIn: 'root' })
export class TrackingStore {
  private readonly trackingApi = inject(TrackingApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly deviceSignal = signal<Device[]>([]);
  readonly devices = this.deviceSignal.asReadonly();
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  private readonly measurementsSignal = signal<Measurement[]>([]);
  readonly measurements = this.measurementsSignal.asReadonly();
  private readonly measurementsLoadingSignal = signal<boolean>(false);
  readonly measurementsLoading = this.measurementsLoadingSignal.asReadonly();
  private readonly measurementsErrorSignal = signal<string | null>(null);
  readonly measurementsError = this.measurementsErrorSignal.asReadonly();

  readonly totalDevices = computed(() => this.devices().length);
  readonly availableDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.AVAILABLE).length
  );
  readonly assignedDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.ASSIGNED).length
  );
  readonly disabledDevices = computed(() =>
    this.devices().filter(d => d.status === DeviceStatus.UNAVAILABLE).length
  );
  readonly gatewayDevice = computed(() =>
    this.devices().find(d => d.deviceType === DeviceType.EDGE_GATEWAY)
  );
  readonly latestMeasurement = computed(() => {
    const items = this.measurements();
    return items.length > 0 ? items[0] : null;
  });

  loadDevices(nursingHomeId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.getDevices(nursingHomeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  loadDeviceById(deviceId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.getDeviceById(deviceId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: device => {
          this.deviceSignal.update(list => {
            const exists = list.some(d => d.id === device.id);
            return exists
              ? list.map(d => d.id === device.id ? device : d)
              : [...list, device];
          });
          this.loadingSignal.set(false);
        },
        error: err => {
          this.loadingSignal.set(false);
          this.errorSignal.set(this.formatError(err, 'Failed to load device'));
        }
      });
  }

  loadDeviceMeasurements(deviceId: number, limit = 50): void {
    this.measurementsLoadingSignal.set(true);
    this.measurementsErrorSignal.set(null);
    this.trackingApi.getDeviceMeasurements(deviceId, limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: measurements => {
          this.measurementsSignal.set(measurements);
          this.measurementsLoadingSignal.set(false);
        },
        error: err => {
          this.measurementsLoadingSignal.set(false);
          this.measurementsErrorSignal.set(this.formatError(err, 'Failed to load telemetry'));
        }
      });
  }

  clearMeasurements(): void {
    this.measurementsSignal.set([]);
    this.measurementsErrorSignal.set(null);
  }

  private deviceFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      externalDeviceId: resource.externalDeviceId ?? '',
      nursingHomeId: resource.nursingHomeId,
      deviceType: resource.deviceType,
      status: resource.status,
      iotStatus: resource.iotStatus ?? 'ACTIVE',
      macAddress: resource.macAddress,
      residentId: resource.residentId,
      assignedAt: resource.assignedAt
    });
  }

  addDevice(command: CreateDeviceCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.createDevice(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        const device = this.deviceFromResource(resource);
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
          list.map(d => d.id === resource.id ? this.deviceFromResource(resource) : d)
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
          list.map(d => d.id === resource.id ? this.deviceFromResource(resource) : d)
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
              externalDeviceId: d.externalDeviceId,
              nursingHomeId: d.nursingHomeId,
              deviceType: d.deviceType,
              iotStatus: d.iotStatus,
              macAddress: d.macAddress,
              assignedAt: d.assignedAt,
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
          list.map(d => d.id === resource.id ? this.deviceFromResource(resource) : d)
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to change device status'));
        this.loadingSignal.set(false);
      }
    });
  }

  changeIotStatus(command: ChangeIotStatusCommand): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.changeIotStatus(command).pipe(retry(2)).subscribe({
      next: (resource: DeviceResource) => {
        this.deviceSignal.update(list =>
          list.map(d => d.id === resource.id ? this.deviceFromResource(resource) : d)
        );
        this.loadingSignal.set(false);
      },
      error: (err: any) => {
        this.errorSignal.set(this.formatError(err, 'Failed to change IoT status'));
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

