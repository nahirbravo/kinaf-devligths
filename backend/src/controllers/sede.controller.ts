import { Request, Response } from "express";
import { Sede } from "../models/Sede";

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Espacios a guiones
    .replace(/[^\w\-]+/g, "") // Eliminar caracteres no alfanuméricos
    .replace(/\-\-+/g, "-") // Eliminar guiones dobles
    .replace(/^-+/, "") // Eliminar guiones al inicio
    .replace(/-+$/, ""); // Eliminar guiones al final
};

export const getSedes = async (req: Request, res: Response) => {
  try {
    const sedes = await Sede.find({ isActive: true });
    res.json({ success: true, data: sedes });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

export const createSede = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;
    const slug = generateSlug(name);

    const exists = await Sede.findOne({ slug });
    if (exists)
      return res
        .status(400)
        .json({
          success: false,
          message: "Ya existe una sede con ese nombre/slug",
        });

    const newSede = await Sede.create({ name, slug, address });
    res.status(201).json({ success: true, data: newSede });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

export const deleteSede = async (req: Request, res: Response) => {
  try {
    // Soft delete (isActive: false) o hard delete según preferencia
    // Para MVP hacemos hard delete para limpiar fácil
    await Sede.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Sede eliminada" });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
