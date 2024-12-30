import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    itemType: {type: String, required: true, trim: true }, 
    quantity: { type: Number, required: true, min: 0 },
    initialQuantity: { type: Number, required: true, min: 0 },
    isLow: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware to check if stock is low before saving
stockSchema.pre("save", function (next) {
  this.isLow = this.quantity <= this.initialQuantity / 2;
  next();
});

// Instance method to restock and reset `isLow`
stockSchema.methods.restock = function (additionalQuantity) {
  this.quantity += additionalQuantity;
  this.isLow = this.quantity <= this.initialQuantity / 2;
  return this.save();
};

// Instance method to reduce stock quantity
stockSchema.methods.reduceStock = function (amount) {
  if (amount > this.quantity) {
    throw new Error("Insufficient stock to reduce.");
  }
  this.quantity -= amount;
  this.isLow = this.quantity <= this.initialQuantity / 2;
  return this.save();
};

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
