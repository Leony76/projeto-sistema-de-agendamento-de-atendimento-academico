import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {

  static async loginAsStudent(req: Request, res: Response):Promise<Response>{

    const { ra, password } = req.body;

    const response = await AuthService.loginAsStudent(
      ra, password
    );

    return res.json(response);
  }

  static async loginAsManager(
    req: Request,
    res: Response,
  ):Promise<Response>{
    const { email, password } = req.body;

    const response = await AuthService.loginAsManager(
      email, password
    )

    return res.json(response);
  }
  
  static async registerAsStudent(req: Request, res: Response):Promise<Response>{
    const {
      studentName,
      email,
      ra,
    } = req.body;

    const response = await AuthService.registerAsStudent(
      studentName, email, ra
    );

    return res.json(response);
  };

  //

  static async registerAsManager(req: Request, res: Response):Promise<Response>{
    const {
      name,
      email,
      password,
      role
    } = req.body;

    const response = await AuthService.registerAsManager(
      name, email, password, role
    );

    return res.json(response);
  }
}