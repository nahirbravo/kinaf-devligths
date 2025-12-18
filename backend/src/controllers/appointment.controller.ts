import { Request, Response } from "express";
import mongoose from "mongoose";
import { Appointment } from "../models/Appointment";
import { Schedule } from "../models/Schedule";
import { startOfDay, endOfDay, parseISO } from "date-fns";

const safeObjectId = (id: any) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { date, serviceId, sedeId } = req.query;
    if (!date || !serviceId || !sedeId)
      return res.status(400).json({ error: "Faltan parámetros" });
    const searchDate = parseISO(date as string);
    const dayOfWeek = searchDate.getDay();

    const schedules = await Schedule.find({
      dayOfWeek,
      sedeId,
      serviceId,
      isActive: true,
    }).populate("professionalId", "firstName lastName email");

    if (schedules.length === 0) return res.json({ success: true, data: [] });

    const existingAppts = await Appointment.find({
      date: { $gte: startOfDay(searchDate), $lte: endOfDay(searchDate) },
      status: { $ne: "cancelled" },
    });

    const slots: any[] = [];
    for (const schedule of schedules) {
      if (!schedule.professionalId) continue;
      const startHour = parseInt(schedule.startTime.split(":")[0]);
      const endHour = parseInt(schedule.endTime.split(":")[0]);
      if (isNaN(startHour) || isNaN(endHour)) continue;

      let currentHour = startHour;
      while (currentHour < endHour) {
        const timeString = `${currentHour.toString().padStart(2, "0")}:00`;
        const isTaken = existingAppts.some((appt) => {
          const apptProId = appt.get("professionalId")?.toString();
          const schedProId = (schedule.professionalId as any)._id?.toString();
          return (
            apptProId &&
            schedProId &&
            appt.startTime === timeString &&
            apptProId === schedProId
          );
        });
        if (!isTaken)
          slots.push({
            time: timeString,
            professional: schedule.professionalId,
          });
        currentHour++;
      }
    }
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error calculando turnos" });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const newAppt = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: newAppt });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appts = await Appointment.find()
      .populate("clientId", "firstName lastName")
      .populate("serviceId", "name")
      .populate("sedeId", "name")
      .populate("professionalId", "firstName lastName")
      .sort({ date: -1 });
    res.json({ success: true, data: appts });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    res.json({ success: true, data: appt });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: appt });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

export const getMyAppointments = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.query;
    if (!clientId)
      return res
        .status(400)
        .json({ success: false, message: "Falta Client ID" });
    const objectId = safeObjectId(clientId);
    if (!objectId)
      return res.status(400).json({ success: false, message: "ID inválido" });

    const appts = await Appointment.find({ clientId: objectId })
      .populate("serviceId", "name price")
      .populate("sedeId", "name address")
      .populate("professionalId", "firstName lastName")
      .sort({ date: -1 });
    res.json({ success: true, data: appts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error interno", error: String(error) });
  }
};
