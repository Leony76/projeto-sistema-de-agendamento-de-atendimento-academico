import type { Request, Response } from "express";
import { UserService } from "./user.service";
import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { UserRole } from "@backend/generated/prisma/enums";

export class UserController {

  public static async getUserBasicInfos(req: Request, res: Response) {

    const { id, role } = req.params;

    const response = await UserService.getUserBasicInfos(Number(id), role as UserRole);
    
    res.status(200).json(response); 
  }

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

  public static async getStudentGeneralInfos(req: Request, res: Response) {

    const { id } = req.params;

    const response = await UserService.getStudentGeneralInfos(Number(id));

    res.status(200).json(response);
  }

  public static async getProfessorGeneralInfos(req: Request, res: Response) {

    const { id } = req.params;

    const response = await UserService.getProfessorGeneralInfos(Number(id));

    res.status(200).json(response);
  }

  public static async getManagerGeneralInfos(req: Request, res: Response) {

    const { id } = req.params;

    const response = await UserService.getManagerGeneralInfos(Number(id));

    res.status(200).json(response);
  }

  public static async excludeUsers(req: Request, res: Response) {

    const { ids } = req.body;

    const excludedUsers = await UserService.excludeUsers(ids as number[]);

    const response: ApiResponse<number[]> = {
      data    : excludedUsers,
      success : true,
      message : (ids as number[]).length > 1
        ? 'Usuários excluídos com sucesso!'
        : 'Usuário excluído com sucesso!'
    };

    res.status(200).json(response);
  }

  public static async getManagerBriefInfos(req: Request, res: Response) {
    
    const response = await UserService.getManagerBriefInfos();

    return res.status(200).json(response);
  }

  public static async getProfessorBriefInfos(req: Request, res: Response) {

    const { id } = req.params; 
    
    const response = await UserService.getProfessorBriefInfos(Number(id));
    
    return res.status(200).json(response);
  }
  
  public static async getStudentBriefInfos(req: Request, res: Response) {

    const { id } = req.params; 
    
    const response = await UserService.getStudentBriefInfos(Number(id));

    return res.status(200).json(response);
  }

  public static async changeUserTemporaryPassword(req: Request, res: Response) {

    const { id } = req.params; 
    const { newPassword } = req.body;
    
    const passwordChanged = await UserService.changeUserTemporaryPassword(
      Number(id), 
      String(newPassword),
    );

    const response: ApiResponse<{ success: boolean }> = {
      message : 'Senha alterada com sucesso',
      success : true,
      data    : passwordChanged,
    }

    return res.status(200).json(response);
  }
}