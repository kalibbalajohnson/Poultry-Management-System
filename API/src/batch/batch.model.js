import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const batchSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    farmId: { type: String, required: true },
    name: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    ageAtArrival: { type: Number, required: true },
    age: { type: Number },
    chickenType: { type: String, required: true },
    quantity: { type: Number, required: true },
    supplier: { type: String, required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Batch = mongoose.model("Batch", batchSchema);

const batchAllocationSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    batchId: { type: String, required: true },
    houseId: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);
const BatchAllocation = mongoose.model("BatchAllocation", batchAllocationSchema);

export { Batch, BatchAllocation };
