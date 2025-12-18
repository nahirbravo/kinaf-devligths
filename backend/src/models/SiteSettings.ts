import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Kinaf" },
    heroTitle: { type: String, default: "Tu salud en movimiento" },
    heroSubtitle: {
      type: String,
      default: "Kinesiología, Pilates y Entrenamiento Personalizado.",
    },
    phone: { type: String, default: "+54 9 341 123 4567" },
    email: { type: String, default: "contacto@kinaf.com" },
    address: { type: String, default: "Rosario, Santa Fe" },
    instagram: { type: String, default: "@kinaf" },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model("SiteSettings", schema);
