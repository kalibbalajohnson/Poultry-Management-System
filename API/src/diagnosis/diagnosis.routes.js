import express from "express";
import diagnosisController from "./diagnosis.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single('image'), diagnosisController.createDiagnosis);
router.get("/farm/:farmId", diagnosisController.getDiagnosesByFarm);
router.get("/:id", diagnosisController.getDiagnosisById);
router.put("/:id", diagnosisController.updateDiagnosis);
router.delete("/:id", diagnosisController.deleteDiagnosis);

export default router;
