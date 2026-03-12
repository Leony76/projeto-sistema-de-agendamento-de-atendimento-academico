import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

  static async me(req: Request, res: Response) {

    try {

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const userData = await UserService.me(userId);

      return res.json(userData);

    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}