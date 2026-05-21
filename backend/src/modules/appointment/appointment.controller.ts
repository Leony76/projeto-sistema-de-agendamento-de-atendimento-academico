import type { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { ApiError } from "@backend/utils/apiError.util";

export class AppointmentController {

  public static async getAvailableProfessorsToSchedule(req: Request, res: Response) {

    const response = await AppointmentService.getAvailableProfessorsToSchedule();

    return res.status(200).json(response);
  }

  public static async getProfessorAvailableSlots(req: Request, res: Response) {

    const { id } = req.params;
    const { date } = req.query;

    if (!id || !date) throw new ApiError('Não foi possível carregar os horários disponíveis da aegndamento', 500);

    const response = await AppointmentService.getProfessorAvailableSlots(Number(id), new Date(String(date)));

    return res.status(200).json(response);
  }
}