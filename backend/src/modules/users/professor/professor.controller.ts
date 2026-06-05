import type { NewProfessorAvailabilityRequest, NewProfessorAvailabilityResponse } from "@shared/types/dtos/newProfessorAvailability.dto";
import type { Request, Response } from "express";
import { ProfessorService } from "./professor.service";
import type { ApiResponse } from "@shared/types/apiResponse.type";

export class ProfessorController {

  public static async defineNewAvailability(req: Request, res: Response) {
    
    const professorId = req.user.sub;
    const data: NewProfessorAvailabilityRequest = req.body;

    const newAvailability = await ProfessorService.defineNewAvailability(professorId, data);

    const response: ApiResponse<NewProfessorAvailabilityResponse['dayOfWeek'][]> = {
      message : 'Nova disponibilidade salva com sucesso!',
      success : true,
      data    : newAvailability.slice(1),
    }

    return res.status(200).json(response);
  }


  
  public static async getAvailability(req: Request, res: Response) {

    const userId = req.user.sub;

    const response = await ProfessorService.getAvailability(userId);

    return res.status(200).json(response);
  }
}