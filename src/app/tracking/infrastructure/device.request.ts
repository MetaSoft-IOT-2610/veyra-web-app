export interface CreateDeviceRequest {
  nursingHomeId:number;
  deviceType:string;
  macAddress:string;
}

export interface AssignDeviceRequest {
  deviceId: number;
  residentId: number;
}
export interface UpdateDeviceRequest {
  deviceType: string;
  macAddress: string;
}
