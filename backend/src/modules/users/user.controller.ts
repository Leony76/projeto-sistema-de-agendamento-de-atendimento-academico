import type { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {

  public static async getActiveStudentsToManagerList(req: Request, res: Response) {

    const response = await UserService.getActiveStudentsToManagerList();
    
    res.status(200).json(response); 
  }
  
  public static async getActiveProfessorsToManagerList(req: Request, res: Response) {

    const response = await UserService.getActiveProfessorsToManagerList();

    res.status(200).json(response);
  }
  
  public static async getActiveManagersToManagerList(req: Request, res: Response) {

    const response = await UserService.getActiveManagersToManagerList();

    res.status(200).json(response);
  }
}