const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    imageUrl: { type: String },
    diesease: { type: String },
    notes: { type: String,  required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

diagnosisSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
module.exports = Diagnosis;
