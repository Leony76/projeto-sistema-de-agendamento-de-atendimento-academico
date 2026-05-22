import type { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { ApiError } from "@backend/utils/apiError.util";
import { type AppointmentSolicitationRequest, type AppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { UserRole } from "@backend/generated/prisma/enums";

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

  public static async solicitateAppointment(req: Request, res: Response) {

    const params = req.body as AppointmentSolicitationRequest;

    const solicitate = await AppointmentService.solicitateAppointment(params);

    const response: ApiResponse<AppointmentSolicitationResponse> = {
      data    : solicitate,
      message : 'Solicitação feita com sucesso!',
      success : true,
    };

    return res.status(200).json(response);
  }

  public static async getUserSolicitations(req: Request, res: Response) {

    const { id, role } = req.params;

    const response = await AppointmentService.getUserSolicitations(role as UserRole, Number(id));

    return res.status(200).json(response);
  }
}