import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

  static async me(
    req : Request, 
    res : Response,
  ):Promise<Response>{
    try {
      const userId = req.user!.id;

      const userData = await UserService.me(userId);
      return res.status(200).json(userData);

    } catch (error: any) {
      console.error(error);    
      const isNotFound = error.message === "Usuário não encontrado";

      return res.status(isNotFound ? 404 : 500).json({ 
        message: isNotFound ? error.message : "Erro interno ao buscar perfil" 
      });
    }
  }
}