import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const feedSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    name: {type: String, required: true, trim: true }, 
    quantity: { type: Number, required: true, min: 0 },
    isLow: { type: Boolean, default: false },
    foodvalue : {type: String, required: true, trim: true }, 
    percentage: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Feed = mongoose.model("Feed", feedSchema);
export default Feed;
