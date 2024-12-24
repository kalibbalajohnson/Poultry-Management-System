const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  uid: { type: String, required: true },
  houses: [{ type: mongoose.Schema.Types.ObjectId, ref: "House" }],
  stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stock" }],
  createdAt: { type: Date, default: Date.now },
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
