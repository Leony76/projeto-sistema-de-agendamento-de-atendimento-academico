import type { Request, Response } from "express";
import { MiscService } from "./misc.service";

export class MiscController {

  public static async getSystemReports(req: Request, res: Response) {

    const response = await MiscService.getSystemReports();

    return res.status(200).json(response);
  };
  
  public static async getManagerBriefInfos(req: Request, res: Response) {
    
    const response = await MiscService.getManagerBriefInfos();

    return res.status(200).json(response);
  }

  public static async getProfessorBriefInfos(req: Request, res: Response) {

    const { id } = req.params; 
    
    const response = await MiscService.getProfessorBriefInfos(Number(id));
    
    return res.status(200).json(response);
  }
  
  public static async getStudentBriefInfos(req: Request, res: Response) {

    const { id } = req.params; 
    
    const response = await MiscService.getStudentBriefInfos(Number(id));

    return res.status(200).json(response);
  }
}