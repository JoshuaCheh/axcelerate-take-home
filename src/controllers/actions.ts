import { Request, Response } from "express";
import {
  getCurrentDevices,
  getUserActions,
  updateDevicesInMemory,
  updateUserActionsInMemory,
} from "../utility";

const undoUserAction = async (req: Request, res: Response) => {
  try {
    const userActions = await getUserActions();
    if (!userActions.length) {
      return res.status(400).json({
        message: "There are no actions to undo",
      });
    }
    // pop last item from user actions list/stack
    const previousAction = userActions.pop();

    const devices = await getCurrentDevices();
    const deviceChanges = previousAction?.changes;
    const updatedDevices = devices.map((device) => {
      const deviceInDeviceChanges = deviceChanges?.find(
        (deviceChange) => deviceChange.deviceId === device.deviceId
      );
      if (deviceInDeviceChanges) {
        return {
          ...device,
          status: deviceInDeviceChanges.previousStatus,
        };
      }
      return device;
    });

    // update user actions in memory
    await updateUserActionsInMemory(userActions);
    // update device list status in memory
    await updateDevicesInMemory(updatedDevices);
    deviceChanges?.map((deviceChange) => {
      console.log(
        `Reverted deviceId: ${deviceChange.deviceId} from ${deviceChange?.newStatus} back to ${deviceChange?.previousStatus}`
      );
    });

    console.log({
      updatedDevices,
    });

    // run update but do the opposite of status
    return res.status(200).json({
      message: "Reverted previous action",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong processing your request, please try again later",
    });
  }
};

export default { undoUserAction };
