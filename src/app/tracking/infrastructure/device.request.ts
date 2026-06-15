export interface CreateDeviceRequest {
  deviceType:string;
  macAddress:string;
}

export interface AssignDeviceRequest {
  residentId: number;
}
export interface UpdateDeviceRequest {
  deviceType: string;
  macAddress: string;
}

export interface ChangeDeviceStatusRequest {
  status: string;
}
