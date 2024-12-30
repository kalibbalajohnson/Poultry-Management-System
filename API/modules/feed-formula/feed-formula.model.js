import mongoose from "mongoose";

const formulaSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    ingredients: [
      {
        name: { type: String, required: true, trim: true, maxlength: 50 },
        quantity: { type: Number, required: true, min: 0 },
      },
    ],
    targetNutrition: {
      type: String,
      enum: [
        "high protein",
        "balanced",
        "high vitamins & minerals",
        "high calcium",
        "high carbohydrate",
      ],
      default: "balanced",
  },
    notes: { type: String, trim: true },
  },
  { timestamps: true } 
);

const Formula = mongoose.model("Formula", formulaSchema);
export default Formula;
