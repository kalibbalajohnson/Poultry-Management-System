import Production from "./production.model.js";
import { Batch } from "../batch/batch.model.js";

// Get all production records for loggedin user's farm
const getProduction = async (req, res) => {
  try {
    const user = req.user;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }
    const batches = await Batch.find({ farmId: user.farmId });

    const batchIds = batches.map((batch) => batch.id);

    const production = await Production.find({ batchId: { $in: batchIds } });

    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createProduction = async (req, res) => {
  try {
    const user = req.user;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const { batchId, date, numberOfDeadBirds, numberOfEggsCollected } =
      req.body;

    const batch = await Batch.findOne({ id: batchId, farmId: user.farmId });
    if (!batch) {
      return res
        .status(404)
        .json({ message: "Batch not found or unauthorized" });
    }

    const newProduction = new Production({
      batchId,
      date,
      numberOfDeadBirds,
      numberOfEggsCollected,
    });

    await newProduction.save();
    res.status(201).json(newProduction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProductionById = async (req, res) => {
  try {
    const user = req.user;
    const productionId = req.params.id;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const production = await Production.findOne({ id: productionId });

    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    const batch = await Batch.findOne({
      id: production.batchId,
      farmId: user.farmId,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this production record" });
    }

    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProduction = async (req, res) => {
  try {
    const user = req.user;
    const productionId = req.params.id;
    const updates = req.body;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const production = await Production.findOne({ id: productionId });
    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    const batch = await Batch.findOne({
      id: production.batchId,
      farmId: user.farmId,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this production record" });
    }

    const updated = await Production.findOneAndUpdate(
      { id: productionId },
      updates,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProduction = async (req, res) => {
  try {
    const user = req.user;
    const productionId = req.params.id;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const production = await Production.findOne({ id: productionId });
    if (!production) {
      return res.status(404).json({ message: "Production not found" });
    }

    const batch = await Batch.findOne({
      id: production.batchId,
      farmId: user.farmId,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this production record" });
    }

    await Production.findOneAndDelete({ id: productionId });

    res.status(200).json({ message: "Production deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  getProduction,
  createProduction,
  getProductionById,
  updateProduction,
  deleteProduction,
};
