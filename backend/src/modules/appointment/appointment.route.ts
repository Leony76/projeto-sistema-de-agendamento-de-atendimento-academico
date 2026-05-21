import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const appointmentRoutes = Router();

appointmentRoutes.get('/schedule/professor/:id/available-slots', AppointmentController.getProfessorAvailableSlots );
appointmentRoutes.get('/schedule/available-professors', AppointmentController.getAvailableProfessorsToSchedule);

export default appointmentRoutes;