import type { Request, Response } from "express";
import { DisciplineService } from "./discipline.service";
import type { ApiResponse } from "@shared/types/apiResponse.type";

export class DisciplineController {

  public static async getNames(req: Request, res: Response) {
    
    const disciplines = await DisciplineService.getNames();

    return res.status(200).json(disciplines);
  };

  public static async getUnboundNames(req: Request, res: Response) {
    
    const disciplines = await DisciplineService.getUnboundNames();

    return res.status(200).json(disciplines);
  };

  public static async add(req: Request, res: Response) {
    
    const { name } = req.body;

    const newDiscipline = await DisciplineService.add(name as string);

    const response: ApiResponse<string> = {
      data    : newDiscipline,
      message : 'Disciplina adicionada com sucesso!',
      success : true,
    } 

    return res.status(201).json(response);
  };
}