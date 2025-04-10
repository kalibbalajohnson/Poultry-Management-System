import Batch from "./batch.model.js";

// Get all batches for the logged-in user's farm
const getBatches = async (req, res) => {
  try {
    const user = req.user;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batches = await Batch.find({ farmId: user.farmId });

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createBatch = async (req, res) => {
  try {
    const user = req.user;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }
    const { name, arrivalDate, ageAtArrival, chickenType, quantity, supplier } = req.body;

    const newBatch = new Batch({
      farmId: user.farmId,
      name,
      arrivalDate,
      ageAtArrival,
      chickenType,
      quantity,
      supplier
    });

    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBatchById = async (req, res) => {
  try {
    const user = req.user;
    const batchId = req.params.id;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOne({ id: batchId, farmId: user.farmId });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateBatch = async (req, res) => {
  try {
    const user = req.user;
    const batchId = req.params.id;
    const updates = req.body;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOneAndUpdate(
      { id: batchId, farmId: user.farmId },
      updates,
      { new: true }
    );

    if (!batch) {
      return res
        .status(404)
        .json({ message: "Batch not found or unauthorized" });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const user = req.user;
    const batchId = req.params.id;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOneAndDelete({
      id: batchId,
      farmId: user.farmId,
    });

    if (!batch) {
      return res
        .status(404)
        .json({ message: "Batch not found or unauthorized" });
    }

    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  getBatches,
  createBatch,
  getBatchById,
  updateBatch,
  deleteBatch,
};