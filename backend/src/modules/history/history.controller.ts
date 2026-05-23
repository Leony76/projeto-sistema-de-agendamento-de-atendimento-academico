import type { UserRole } from "@backend/generated/prisma/enums";
import type { Request, Response } from "express";
import { HistoryService } from "./history.service";

export class HistoryController {

  public static async getUserAppointmentsHistory(req: Request, res: Response) {

    const { role, id } = req.params;

    const response = await HistoryService.getUserAppointmentsHistory(role as UserRole, Number(id));

    return res.status(200).json(response);
  }
}