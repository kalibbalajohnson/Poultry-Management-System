// const mongoose = require("mongoose");
import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    uid: { type: String, required: true, unique: true },
    houses: [{ type: mongoose.Schema.Types.ObjectId, ref: "House" }],
    stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stock" }],
  },
  { timestamps: true } 
);

const Farm = mongoose.model("Farm", farmSchema);
export default Farm;
