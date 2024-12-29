const mongoose = require("mongoose");

const immunizationSchema = new mongoose.Schema({
    house: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true, index: true },
    scheduledStartDate: { type: Date, required: true }, 
    scheduledEndDate: { type: Date }, 
    vaccineName: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

immunizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Immunization = mongoose.model("Immunization", immunizationSchema);
module.exports = Immunization;
