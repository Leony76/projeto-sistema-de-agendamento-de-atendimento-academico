import type { Request, Response } from "express";
import { MiscService } from "./misc.service";

export class MiscController {

  public static async getSystemReports(req: Request, res: Response) {

    const response = await MiscService.getSystemReports();

    return res.status(200).json(response);
  };

}