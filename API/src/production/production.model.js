import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productionSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    batchId: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
    numberOfDeadBirds: { type: Number },
    numberOfEggsCollected: { type: Number },
    notes: { type: String },
  },
  { timestamps: true } 
);

const Production = mongoose.model("Production", productionSchema);
export default Production;
