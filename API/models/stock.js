const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  itemType: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  initialQuantity: { type: Number, required: true }, 
  isLow: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to check if stock is low
stockSchema.pre("save", function (next) {
  this.isLow = this.quantity <= this.initialQuantity / 2;
  this.updatedAt = Date.now();
  next();
});

// Static method to restock and reset `isLow`
stockSchema.methods.restock = function (additionalQuantity) {
  this.quantity += additionalQuantity;
  this.isLow = this.quantity <= this.initialQuantity / 2;
  return this.save();
};

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
