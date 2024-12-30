import mongoose from 'mongoose';

const immunizationSchema = new mongoose.Schema({
    house: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true, index: true },
    scheduledStartDate: { type: Date, required: true }, 
    scheduledEndDate: { type: Date }, 
    vaccineName: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
    reminderSent: { type: Boolean, default: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }, 
  { timestamps: true }
);

const Immunization = mongoose.model("Immunization", immunizationSchema);
export default Immunization;
