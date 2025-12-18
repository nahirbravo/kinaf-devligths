import { Request, Response } from "express";
import { Service } from "../models/Service";

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json({ success: true, data: services });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Servicio eliminado" });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
