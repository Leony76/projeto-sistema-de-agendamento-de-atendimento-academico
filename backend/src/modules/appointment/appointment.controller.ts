import type { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { ApiError } from "@backend/utils/apiError.util";
import { type AppointmentSolicitationRequest, type AppointmentSolicitationResponse, type EditAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { UserRole } from "@backend/generated/prisma/enums";
import type { SolicitationDecision } from "@shared/types/solicitationDecision.type";
import type { EditAppointmentSolicitationFormData } from "@backend/schemas/appointmentSolicitation.schema";

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



  public static async acceptOrDenyAppointmentSolicitation(req: Request, res: Response) {

    const { solicitationId, decision } = req.params;

    const decisionDone = await AppointmentService.acceptOrDenyAppointmentSolicitation(
      Number(solicitationId), 
      decision as SolicitationDecision
    );

    const response: ApiResponse<{ decision: SolicitationDecision }> = {
      data    : { decision: decisionDone.decision },
      success : true,
      message : decisionDone.decision === 'ACCEPTED'
        ? 'Solicitação aceita com sucesso!'
        : 'Solicitação rejeitada com sucesso!'
    };

    return res.status(200).json(response);
  }



  public static async getUserAppointments(req: Request, res: Response) {

    const { id, role } = req.params;

    const response = await AppointmentService.getUserAppointments(Number(id), role as UserRole);

    return res.status(200).json(response);
  }



  public static async markAppointmentAsDone(req: Request, res: Response) {

    const { appointmentId } = req.params;

    const markAppointmentAsDone = await AppointmentService.markAppointmentAsDone(Number(appointmentId));

    const response: ApiResponse<{appointmentId: number}> = { 
      data    : { appointmentId: markAppointmentAsDone.appointmentId },
      message : 'Atendimento marcado como concluído com sucesso!',
      success : true, 
    };

    return res.status(200).json(response);
  }



  public static async editSolicitation(req: Request, res: Response) {

    const data = req.body as EditAppointmentSolicitationResponse;

    const editedSolicitation = await AppointmentService.editSolicitation(data);

    const response: ApiResponse<EditAppointmentSolicitationResponse> = { 
      data    : editedSolicitation,
      message : 'Solicitação editada com sucesso!',
      success : true, 
    };

    return res.status(200).json(response);
  }



  public static async cancelSolicitation(req: Request, res: Response) {

    const { appointmentId } = req.params;

    const cancelSolicitation = await AppointmentService.cancelSolicitation(Number(appointmentId));

    const response: ApiResponse<{ id: number }> = { 
      data    : cancelSolicitation,
      message : 'Solicitação cancelada com sucesso!',
      success : true, 
    };

    return res.status(200).json(response);
  }
}