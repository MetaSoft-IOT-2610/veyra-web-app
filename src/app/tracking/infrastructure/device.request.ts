export interface CreateDeviceRequest {
  externalDeviceId: string;
  deviceType:string;
  macAddress:string;
}

export interface AssignDeviceRequest {
  residentId: number;
}
export interface UpdateDeviceRequest {
  externalDeviceId: string;
  deviceType: string;
  macAddress: string;
}

export interface ChangeDeviceStatusRequest {
  status: string;
}

export interface ChangeIotStatusRequest {
  iotStatus: string;
}
