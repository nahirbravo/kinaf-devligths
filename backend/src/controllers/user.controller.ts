import { Request, Response } from "express";
import { User } from "../models/User";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const pros = await User.find({
      role: "professional",
      isActive: true,
    }).select("firstName lastName email");
    res.json({ success: true, data: pros });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

export const createProfessional = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "El email ya está registrado" });

    const newPro = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "professional",
    });

    res.status(201).json({ success: true, data: newPro });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

export const deleteProfessional = async (req: Request, res: Response) => {
  try {
    // Soft delete (isActive: false) o hard delete según preferencia
    // Para MVP hacemos hard delete para limpiar fácil
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Profesional eliminado" });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
