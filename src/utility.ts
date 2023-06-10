import {
  Device,
  DeviceChange,
  LocalStorageVariables,
  UpdateDeviceRequestBody,
  UserAction,
} from "./types";
import storage from "node-persist";

export const getCurrentDevices = async (): Promise<Device[]> => {
  return JSON.parse(await storage.getItem(LocalStorageVariables.Devices));
};

export const getUserActions = async (): Promise<UserAction[]> => {
  return JSON.parse(await storage.getItem(LocalStorageVariables.UserActions));
};

export const addDeviceInMemory = async (newDevice: Device) => {
  const currentDevices = await getCurrentDevices();
  const updatedDevices: Device[] = [...currentDevices, newDevice];
  await updateDevicesInMemory(updatedDevices);
};

export const updateDevicesInMemory = async (updatedDevices: Device[]) => {
  await storage.setItem(
    LocalStorageVariables.Devices,
    JSON.stringify(updatedDevices)
  );
};

export const addUserActionInMemory = async (userAction: UserAction) => {
  const updatedUserActionsList: UserAction[] = [
    ...JSON.parse(await storage.getItem(LocalStorageVariables.UserActions)),
    userAction,
  ];
  await storage.setItem(
    LocalStorageVariables.UserActions,
    JSON.stringify(updatedUserActionsList)
  );

  const printAbleList = updatedUserActionsList.reduce((result, curr) => {
    return [...result, curr.changes];
  }, [] as DeviceChange[][]);
  console.log(`User Actions: `);
  console.log(printAbleList);
};

export const updateUserActionsInMemory = async (
  updatedUserActions: UserAction[]
) => {
  await storage.setItem(
    LocalStorageVariables.UserActions,
    JSON.stringify(updatedUserActions)
  );
};
