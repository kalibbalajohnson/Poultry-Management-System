import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const houseSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    houseName: { type: String, required: true },
    responsiblePerson: { type: String, required: true },
    houseCapacity: { type: Number },
    numberOfHens: { type: Number },
    houseType: { type: String, enum: ["Caged", "Deep Litter"] },
    isMonitored: { type: Boolean, default: false },
    records: [{ type: mongoose.Schema.Types.ObjectId, ref: "DailyRecord" }],
  },
  { timestamps: true } 
);

const House = mongoose.model("House", houseSchema);
export default House;
