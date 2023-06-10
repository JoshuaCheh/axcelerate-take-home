import express from "express";
import controller from "../controllers/devices";
const router = express.Router();

router.get("/", controller.getDevices);
router.put("/", controller.updateDevices);
router.post("/", controller.addDevice);

export = router;
