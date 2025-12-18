import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // minutes
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Service = mongoose.model("Service", serviceSchema);
