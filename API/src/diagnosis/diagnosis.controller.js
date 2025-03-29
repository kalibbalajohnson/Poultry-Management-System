import { storage } from "../../config/firebase.js"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Diagnosis from "./diagnosis.model.js";
import { getDiseasePrediction } from "../../config/utils.js";

const createDiagnosis = async (req, res) => {
  try {
    const farmId = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const disease = await getDiseasePrediction(image);
    if (!disease) {
      return res.status(500).json({ message: "Error predicting disease" });
    }

    const storageRef = ref(storage, `diagnosisImages/${image.originalname}`);
    const snapshot = await uploadBytes(storageRef, image.buffer);
    console.log("Uploaded file:", snapshot);

    const imageUrl = await getDownloadURL(snapshot.ref);

    const newDiagnosis = new Diagnosis({
      farmId,
      imageUrl,
      disease,
    });

    const savedDiagnosis = await newDiagnosis.save();

    res.status(201).json({
      message: "Diagnosis created successfully",
      diagnosis: savedDiagnosis,
    });
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    res
      .status(500)
      .json({ message: "Error creating diagnosis", error: error.message });
  }
};

const getDiagnosesByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    const diagnoses = await Diagnosis.find({ farmId });

    if (diagnoses.length === 0) {
      return res
        .status(404)
        .json({ message: "No diagnoses found for this farm" });
    }

    res.status(200).json({
      message: "Diagnoses retrieved successfully",
      diagnoses,
    });
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    res
      .status(500)
      .json({ message: "Error fetching diagnoses", error: error.message });
  }
};

const getDiagnosisById = async (req, res) => {
  try {
    const { id } = req.params;

    const diagnosis = await Diagnosis.findOne({ id });

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.status(200).json({
      message: "Diagnosis retrieved successfully",
      diagnosis,
    });
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    res
      .status(500)
      .json({ message: "Error fetching diagnosis", error: error.message });
  }
};

const updateDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, disease, notes } = req.body;

    const updatedDiagnosis = await Diagnosis.findOneAndUpdate(
      { id },
      { imageUrl, disease, notes },
      { new: true }
    );

    if (!updatedDiagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.status(200).json({
      message: "Diagnosis updated successfully",
      diagnosis: updatedDiagnosis,
    });
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    res
      .status(500)
      .json({ message: "Error updating diagnosis", error: error.message });
  }
};

const deleteDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDiagnosis = await Diagnosis.findOneAndDelete({ id });

    if (!deletedDiagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.status(200).json({
      message: "Diagnosis deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting diagnosis:", error);
    res
      .status(500)
      .json({ message: "Error deleting diagnosis", error: error.message });
  }
};

export default {
  createDiagnosis,
  getDiagnosesByFarm,
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
};
