import express from "express";
import diagnosisController from "./diagnosis.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/diagnosis", upload.single('image'), diagnosisController.createDiagnosis);
router.get("/diagnosis/farm/:farmId", diagnosisController.getDiagnosesByFarm);
router.get("/diagnosis/:id", diagnosisController.getDiagnosisById);
router.put("/diagnosis/:id", diagnosisController.updateDiagnosis);
router.delete("/diagnosis/:id", diagnosisController.deleteDiagnosis);

export default router;
