import { Batch, BatchAllocation } from "./batch.model.js";
import House from "../house/house.model.js";

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
    const { name, arrivalDate, ageAtArrival, chickenType, quantity, supplier } =
      req.body;

    const newBatch = new Batch({
      farmId: user.farmId,
      name,
      arrivalDate,
      ageAtArrival,
      chickenType,
      quantity,
      supplier,
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

const createBatchAllocation = async (req, res) => {
  try {
    const user = req.user;
    const { batchId, houseId, quantity } = req.body;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOne({ id: batchId, farmId: user.farmId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (quantity > batch.quantity) {
      return res.status(400).json({ message: "Not enough birds in batch" });
    }

    const house = await House.findOne({ id: houseId, farmId: user.farmId });
    if (!house) {
      return res
        .status(404)
        .json({ message: "House not found or unauthorized" });
    }

    const existingAllocation = await BatchAllocation.findOne({
      batchId,
      houseId,
    });
    const existingQuantity = existingAllocation
      ? existingAllocation.quantity
      : 0;
    const totalQuantity = existingQuantity + quantity;

    if (house.capacity && totalQuantity > house.capacity) {
      return res
        .status(400)
        .json({ message: "Allocation exceeds house capacity" });
    }

    let allocation;
    if (existingAllocation) {
      existingAllocation.quantity += quantity;
      allocation = await existingAllocation.save();
    } else {
      allocation = new BatchAllocation({ batchId, houseId, quantity });
      await allocation.save();
    }

    batch.quantity -= quantity;
    await batch.save();

    res.status(201).json(allocation);
  } catch (error) {
    console.error("Batch Allocation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBatchAllocations = async (req, res) => {
  try {
    const user = req.user;
    const { batchId } = req.params;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOne({ id: batchId, farmId: user.farmId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const allocations = await BatchAllocation.find({ batchId });
    res.status(200).json(allocations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHouseBatchAllocations = async (req, res) => {
  try {
    const user = req.user;
    const { houseId } = req.params;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const house = await House.findOne({ id: houseId, farmId: user.farmId });
    if (!house) {
      return res
        .status(404)
        .json({ message: "House not found or unauthorized" });
    }

    const allocations = await BatchAllocation.find({ houseId: houseId });
    res.status(200).json(allocations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateBatchAllocation = async (req, res) => {
  try {
    const user = req.user;
    const allocationId = req.params.id;
    const { quantity } = req.body;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const allocation = await BatchAllocation.findOne({ id: allocationId });
    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    const batch = await Batch.findOne({
      id: allocation.batchId,
      farmId: user.farmId,
    });
    if (!batch) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this allocation" });
    }

    const house = await House.findOne({
      id: allocation.houseId,
      farmId: user.farmId,
    });
    if (!house) {
      return res
        .status(404)
        .json({ message: "House not found or unauthorized" });
    }

    if (house.capacity && quantity > house.capacity) {
      return res
        .status(400)
        .json({ message: "Updated quantity exceeds house capacity" });
    }

    allocation.quantity = quantity;
    await allocation.save();

    res.status(200).json(allocation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const transferBirds = async (req, res) => {
  try {
    const user = req.user;
    const { batchId, fromHouseId, toHouseId, quantity } = req.body;

    if (!user.farmId) {
      return res
        .status(400)
        .json({ message: "User does not belong to a farm" });
    }

    const batch = await Batch.findOne({ id: batchId, farmId: user.farmId });
    if (!batch) {
      return res
        .status(404)
        .json({ message: "Batch not found or unauthorized" });
    }

    const fromAllocation = await BatchAllocation.findOne({
      batchId,
      houseId: fromHouseId,
    });

    if (!fromAllocation || fromAllocation.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient birds to transfer" });
    }

    const toHouse = await House.findOne({ id: toHouseId, farmId: user.farmId });
    if (!toHouse) {
      return res
        .status(404)
        .json({ message: "Destination house not found or unauthorized" });
    }

    const toAllocation = await BatchAllocation.findOne({
      batchId,
      houseId: toHouseId,
    });

    const currentToQuantity = toAllocation ? toAllocation.quantity : 0;
    const totalToQuantity = currentToQuantity + quantity;

    if (toHouse.capacity && totalToQuantity > toHouse.capacity) {
      return res
        .status(400)
        .json({ message: "Transfer exceeds destination house capacity" });
    }

    fromAllocation.quantity -= quantity;
    await fromAllocation.save();

    if (toAllocation) {
      toAllocation.quantity += quantity;
      await toAllocation.save();
    } else {
      const newAllocation = new BatchAllocation({
        batchId,
        houseId: toHouseId,
        quantity,
      });
      await newAllocation.save();
    }

    res.status(200).json({
      message: "Birds transferred successfully",
      from: fromAllocation,
      to: toAllocation || newAllocation,
    });
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
  createBatchAllocation,
  getBatchAllocations,
  getHouseBatchAllocations,
  updateBatchAllocation,
  transferBirds,
};