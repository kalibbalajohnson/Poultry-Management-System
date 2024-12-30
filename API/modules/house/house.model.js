import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    houseName: { type: String, required: true },
    responsiblePerson: { type: String, required: true },
    houseCapacity: { type: Number },
    numberOfHens: { type: Number },
    houseType: { type: String, enum: ["Brooder", "Grower", "Layer", "OffLayer"] },
    isMonitored: { type: Boolean, default: false },
    records: [{ type: mongoose.Schema.Types.ObjectId, ref: "DailyRecord" }],
  },
  { timestamps: true } 
);

const House = mongoose.model("House", houseSchema);
export default House;
