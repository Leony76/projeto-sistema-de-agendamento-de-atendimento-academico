import type { Request, Response } from 'express';
import { ManagerService } from './manager.service';

export class ManagerController {

  public static async registerNewUser(req: Request, res: Response) {
    
    const result = await ManagerService.registerNewUser(req.body);

    return res.status(201).json(result);
  };
}