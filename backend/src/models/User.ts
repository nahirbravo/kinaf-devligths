import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "admin" | "professional" | "client";
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "professional", "client"],
      default: "client",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password as string);
};

export const User = mongoose.model<IUser>("User", userSchema);
