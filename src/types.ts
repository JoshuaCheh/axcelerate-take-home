export enum LocalStorageVariables {
  Devices = "Devices",
  UserActions = "UserActions",
}

export interface Device {
  deviceId: string;
  deviceName: string;
  status: boolean;
}

export interface AddDeviceRequestBody {
  deviceName: string;
}

export interface UpdateDeviceRequestBody {
  status: boolean;
}

export interface UpdateDevicesRequestBody {
  deviceIds: string[];
  status: boolean;
}

export interface UserAction {
  changes: DeviceChange[];
}

export interface DeviceChange {
  deviceId: string;
  previousStatus: boolean;
  newStatus: boolean;
}
