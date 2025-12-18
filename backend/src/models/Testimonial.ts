import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model("Testimonial", schema);
