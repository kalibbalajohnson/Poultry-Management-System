import express from "express";
import monitoringController from "./monitoring.controller.js";
import authMiddleware from "../../config/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("house/:houseId", monitoringController.getSensorDataForHouse);
router.post("/house", monitoringController.createSensorDataForHouse);

export default router;