import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const appointmentRoutes = Router();

appointmentRoutes.get('/schedule/professor/:id/available-slots' , AppointmentController.getProfessorAvailableSlots );
appointmentRoutes.get('/schedule/available-professors'          , AppointmentController.getAvailableProfessorsToSchedule);
appointmentRoutes.post('/schedule/solicitate'                   , AppointmentController.solicitateAppointment);
appointmentRoutes.get('/solicitations'                          , AppointmentController.getUserSolicitations);
appointmentRoutes.patch('/schedule/solicitation-request/:solicitationId/:decision', AppointmentController.acceptOrDenyAppointmentSolicitation);
appointmentRoutes.get('/'                                       , AppointmentController.getUserAppointments);
appointmentRoutes.patch('/:appointmentId/mark-as-done'          , AppointmentController.markAppointmentAsDone);
appointmentRoutes.patch('/:appointmentId/edit'                  , AppointmentController.editAppointment);
appointmentRoutes.patch('/:appointmentId/cancel'                , AppointmentController.cancelAppointment);
appointmentRoutes.patch('/solicitation/:appointmentId/remove'   , AppointmentController.removeSolicitation);

export default appointmentRoutes;