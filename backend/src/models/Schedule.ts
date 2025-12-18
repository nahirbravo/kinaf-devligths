import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
