import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  AddDeviceRequestBody,
  Device,
  DeviceChange,
  UpdateDeviceRequestBody,
  UpdateDevicesRequestBody,
} from "../types";
import {
  addDeviceInMemory,
  getCurrentDevices,
  updateDevicesInMemory,
  addUserActionInMemory,
} from "../utility";

const getDevices = async (req: Request, res: Response) => {
  try {
    const deviceList: Device[] = await getCurrentDevices();

    return res.status(200).json({
      deviceList,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong processing your request, please try again later",
    });
  }
};

const addDevice = async (req: Request, res: Response) => {
  try {
    const requestBody: AddDeviceRequestBody = req.body;
    const newDeviceName = requestBody?.deviceName;

    if (!newDeviceName) {
      return res.status(400).json({
        message: "Missing deviceName in json body request",
      });
    }
    const currentDevices: Device[] = await getCurrentDevices();
    const deviceIsInSystem = currentDevices.find(
      (existingDevice) => existingDevice.deviceName === newDeviceName
    );
    if (deviceIsInSystem) {
      return res.status(409).json({
        message:
          "The deviceName payload provided is a duplicate of an existing device. Please use a different name.",
      });
    }

    const newDevice = {
      deviceId: uuidv4(),
      deviceName: newDeviceName,
      status: false,
    };
    await addDeviceInMemory(newDevice);
    return res.status(200).json({
      deviceId: newDevice.deviceId,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong processing your request, please try again later",
    });
  }
};

const updateDevices = async (req: Request, res: Response) => {
  try {
    const requestBody: UpdateDevicesRequestBody = req.body;
    const deviceIds = Array.from(new Set(requestBody?.deviceIds)); // deduplicate any ids just to be safe
    const newStatus = requestBody?.status;

    if (deviceIds?.length && newStatus !== undefined) {
      const currentDevices: Device[] = await getCurrentDevices();

      const newStatus = requestBody?.status;

      const missingDeviceInSystem = deviceIds.some(
        (deviceId) =>
          !currentDevices.find(
            (existingDevice) => existingDevice.deviceId === deviceId
          )
      );
      if (!missingDeviceInSystem) {
        await updateMultipleDevicesStatus(deviceIds, newStatus);

        return res.status(200).json({
          message: "Updated Device status",
        });
      } else {
        return res.status(404).json({
          message: `One of the deviceIds provided, is currently not in system`,
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong processing your request, please try again later",
    });
  }
};

const updateMultipleDevicesStatus = async (
  deviceIds: string[],
  newDeviceStatus: boolean
) => {
  const currentDevices = await getCurrentDevices();
  const deviceChanges: DeviceChange[] = [];
  const updatedDevices = currentDevices.map((existingDevice) => {
    if (deviceIds.includes(existingDevice.deviceId)) {
      deviceChanges.push({
        deviceId: existingDevice.deviceId,
        previousStatus: existingDevice.status,
        newStatus: newDeviceStatus,
      });
      return {
        ...existingDevice,
        status: newDeviceStatus,
      };
    }
    return existingDevice;
  });

  await updateDevicesInMemory(updatedDevices);
  await addUserActionInMemory({
    changes: deviceChanges,
  });

  console.log({
    newDeviceStatuses: updatedDevices,
  });
};

export default { getDevices, addDevice, updateDevices };
