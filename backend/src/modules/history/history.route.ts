import { Router } from "express";
import { HistoryController } from "./history.controller";

const historyRoutes = Router();

historyRoutes.get('/:role/:id/appointment' , HistoryController.getUserAppointmentsHistory);
historyRoutes.patch('/:id/remove'          , HistoryController.removeAppointmentHistory);

export default historyRoutes;