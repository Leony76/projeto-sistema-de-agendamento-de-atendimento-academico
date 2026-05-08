import type { Request, Response } from "express";
import { DisciplineService } from "./discipline.service";

export class DisciplineController {

  public static async getNames(req: Request, res: Response) {
    
    const disciplines = await DisciplineService.getNames();

    return res.status(200).json(disciplines);
  };

  public static async getUnboundNames(req: Request, res: Response) {
    
    const disciplines = await DisciplineService.getUnboundNames();

    return res.status(200).json(disciplines);
  };
}