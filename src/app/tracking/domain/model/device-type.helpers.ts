import { DeviceType } from './device-type.enum';

export function isEdgeGateway(deviceType: string): boolean {
  return deviceType === DeviceType.EDGE_GATEWAY;
}

export function isAssignableDeviceType(deviceType: string): boolean {
  return !isEdgeGateway(deviceType);
}

export function supportsTelemetry(deviceType: string): boolean {
  return deviceType === DeviceType.VITAL_SIGNS || deviceType === DeviceType.GPS;
}

export function deviceTypeIcon(deviceType: string): string {
  if (deviceType === DeviceType.EDGE_GATEWAY) return 'router';
  if (deviceType === DeviceType.GPS) return 'location_on';
  return 'monitor_heart';
}

export function deviceTypeIconClass(deviceType: string): string {
  if (deviceType === DeviceType.EDGE_GATEWAY) return 'icon-gateway';
  if (deviceType === DeviceType.GPS) return 'icon-gps';
  return 'icon-vital';
}

export function deviceTypeLabelKey(deviceType: string): string {
  return `tracking.devices.device-types.${deviceType}`;
}
