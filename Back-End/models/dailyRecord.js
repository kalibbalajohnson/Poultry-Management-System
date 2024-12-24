const mongoose = require("mongoose");

const dailyRecordSchema = new mongoose.Schema({
  house: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true, index: true },
  date: { type: Date, default: Date.now, index: true },
  averageTemperature: { type: Number},
  averageHumidity: { type: Number },
  averageAirQuality: { type: Number},
  numberOfDeadHens: { type: Number},
  numberOfEggsCollected: { type: Number },
  dailyFeedConsumed: { type: Number},
  feedFomular: { type: String },
  isImmunizedInPastTwoDays: { type: Boolean, default: false },
  externalWeatherCondition: { type: String, enum: ["Sunny", "Cloudy", "Rainy"] },
  notes: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

dailyRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const DailyRecord = mongoose.model("DailyRecord", dailyRecordSchema);
module.exports = DailyRecord;
