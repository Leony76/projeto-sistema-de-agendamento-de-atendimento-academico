import { Router } from "express";
import { HistoryController } from "./history.controller";

const historyRoutes = Router();

historyRoutes.get('/:role/:id/appointment', HistoryController.getUserAppointmentsHistory);

export default historyRoutes;