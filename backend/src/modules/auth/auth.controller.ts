import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {

  static async register(req: Request, res: Response) {

    const user = await AuthService.register(req.body);

    return res.status(201).json(user);
  }



  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login(
      email,
      password
    );

    return res.status(302).json(result);
  }
}