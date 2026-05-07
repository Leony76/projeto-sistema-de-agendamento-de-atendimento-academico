import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {

  static async register(req: Request, res: Response) {

    const user = await AuthService.register(req.body);

    return res.status(201).json(user);
  }



  static async login(req: Request, res: Response) {
    
    const { role, password } = req.body;

    switch (role as 'STUDENT' | 'PROFESSOR/MANAGER') {
      case 'STUDENT': {
        const { ra } = req.body;

        const result = await AuthService.login({
          role,
          ra,
          password,
        });

        return res.status(200).json(result);

      } case 'PROFESSOR/MANAGER' : {

        const { email } = req.body;

        const result = await AuthService.login({
          role,
          email,
          password,
        });

        return res.status(200).json(result);
      }
    }
  }
}