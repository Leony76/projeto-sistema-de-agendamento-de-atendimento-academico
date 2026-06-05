import type { Request, Response } from "express";
import { HistoryService } from "./history.service";
import type { ApiResponse } from "@shared/types/apiResponse.type";
import { ApiError } from "@backend/utils/apiError.util";

export class HistoryController {

  public static async getUserAppointmentsHistory(req: Request, res: Response) {

    const userId = req.user.sub;
    const role = req.user.role;

    const response = await HistoryService.getUserAppointmentsHistory(role, userId);

    return res.status(200).json(response);
  }



  public static async removeAppointmentHistory(req: Request, res: Response) {

    const { id } = req.params;
    const userId = req.user.sub;
    const role = req.user.role;

    if (role === 'MANAGER') 
      throw new ApiError('Gestores não têm acesso para remoção do histórico de atendimento de usuários!', 403);

    const removed = await HistoryService.removeAppointmentHistory(
      Number(id), 
      userId,
      role
    );

    const response: ApiResponse<{id: number}> = {
      data    : { id: removed.id },
      message : 'Registro do histórico de atendimento removido com sucesso!',
      success : true,
    };

    return res.status(200).json(response);
  }
}