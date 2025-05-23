import express from "express";
import monitoringController from "./monitoring.controller.js";
import authMiddleware from "../../config/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", monitoringController.getSensorDataForHouse);
router.post("/", monitoringController.createSensorDataForHouse);

export default router;