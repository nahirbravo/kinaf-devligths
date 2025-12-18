import { Request, Response } from "express";
import { Schedule } from "../models/Schedule";

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.find({ isActive: true })
      .populate("professionalId", "firstName lastName")
      .populate("sedeId", "name")
      .populate("serviceId", "name");
    res.json({ success: true, data: schedules });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Horario eliminado" });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};
