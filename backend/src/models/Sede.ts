import mongoose from "mongoose";
const sedeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Sede = mongoose.model("Sede", sedeSchema);
