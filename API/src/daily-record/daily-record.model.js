import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const dailyRecordSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true, required: true },
    house: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
    averageTemperature: { type: Number },
    averageHumidity: { type: Number },
    averageAirQuality: { type: Number },
    numberOfDeadHens: { type: Number },
    numberOfEggsCollected: { type: Number },
    dailyFeedConsumed: { type: Number },
    feedFomular: { type: String },
    isImmunizedInPastTwoDays: { type: Boolean, default: false },
    externalWeatherCondition: { type: String, enum: ["Sunny", "Cloudy", "Rainy"] },
    notes: { type: String },
  },
  { timestamps: true } 
);

const DailyRecord = mongoose.model("DailyRecord", dailyRecordSchema);
export default DailyRecord;
