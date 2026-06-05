import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { Request, Response } from "express";
import { RoomService } from "./room.service";

export class RoomController {

  public static async addRoom(req: Request, res: Response) {

    const { name } = req.body;

    const newRoom = await RoomService.addRoom(String(name));

    const response: ApiResponse<string> = {
      data    : newRoom,
      message : 'Sala adicionada com sucesso!',
      success : true,
    };

    return res.status(201).json(response);
  }


  
  public static async getAll(req: Request, res: Response) {

    const response = await RoomService.getAll();

    return res.status(201).json(response);
  }
}