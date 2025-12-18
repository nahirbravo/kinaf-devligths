import { Router } from "express";
import authRoutes from "./auth.routes";
import { protect, restrictTo } from "../middleware/auth";
import {
  getAvailableSlots,
  createAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getMyAppointments,
} from "../controllers/appointment.controller";
import {
  getServices,
  createService,
  deleteService,
} from "../controllers/service.controller";
import {
  getSedes,
  createSede,
  deleteSede,
} from "../controllers/sede.controller";
import {
  getSettings,
  updateSettings,
  getTestimonials,
  createTestimonial,
  sendContact,
} from "../controllers/cms.controller";
import {
  getProfessionals,
  createProfessional,
  deleteProfessional,
} from "../controllers/user.controller";
import {
  createSchedule,
  getSchedules,
  deleteSchedule,
} from "../controllers/schedule.controller";

const router = Router();

router.use("/auth", authRoutes);

// --- Public ---
router.get("/sedes", getSedes);
router.get("/services", getServices);
router.get("/settings", getSettings);
router.get("/testimonials", getTestimonials);
router.post("/contact", sendContact);
router.get("/slots", getAvailableSlots);

// --- Protected ---
router.use(protect as any);
router.post("/appointments", createAppointment);
router.get("/appointments/my", getMyAppointments);
router.patch("/appointments/:id/cancel", cancelAppointment);

// --- Admin Only ---
router.use(restrictTo("admin") as any);

// Appointments
router.get("/appointments", getAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);

// Management
router.post("/services", createService);
router.delete("/services/:id", deleteService);

router.post("/sedes", createSede);
router.delete("/sedes/:id", deleteSede);

router.get("/users/professionals", getProfessionals);
router.post("/users/professionals", createProfessional);
router.delete("/users/professionals/:id", deleteProfessional);

router.get("/schedules", getSchedules);
router.post("/schedules", createSchedule);
router.delete("/schedules/:id", deleteSchedule);

router.put("/settings", updateSettings);
router.post("/testimonials", createTestimonial);

export default router;
