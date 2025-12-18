import { Request, Response } from "express";
import { SiteSettings } from "../models/SiteSettings";
import { Testimonial } from "../models/Testimonial";
import { ContactMessage } from "../models/ContactMessage";

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json({ success: true, data: settings });
  } catch (e) {
    res.status(400).json({ success: false, error: e });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  const list = await Testimonial.find({ isActive: true });
  res.json({ success: true, data: list });
};

export const createTestimonial = async (req: Request, res: Response) => {
  const item = await Testimonial.create(req.body);
  res.json({ success: true, data: item });
};

export const sendContact = async (req: Request, res: Response) => {
  await ContactMessage.create(req.body);
  res.json({ success: true, message: "Mensaje enviado" });
};
