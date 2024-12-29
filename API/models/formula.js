const mongoose = require("mongoose");

const formulaSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  name: { type: String, required: true }, 
  ingredients: [
    {
      name: { type: String, required: true }, 
      quantity: { type: Number, required: true }, 
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
    default: "balanced" 
},
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

formulaSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Formula = mongoose.model("Formula", formulaSchema);
module.exports = Formula;
