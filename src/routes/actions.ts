import express from "express";
import controller from "../controllers/actions";
const router = express.Router();

router.post("/undo", controller.undoUserAction);

export = router;
