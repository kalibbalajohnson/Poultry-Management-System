import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    imageUrl: { type: String },
    disease: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

export default Diagnosis;
