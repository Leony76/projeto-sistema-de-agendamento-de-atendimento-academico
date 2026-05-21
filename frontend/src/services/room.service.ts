import type { ApiResponse } from "@shared/types/apiResponse.type";
import { api } from "./api.service";
import type { RoomResponse } from "@shared/types/dtos/room.dto";

export class RoomService {

  public static async newRoom(name: string) {

    const response = await api.post<ApiResponse<string>>('/room/add', { name });

    return response.data;
  }

  public static async getRooms() {

    const response = await api.get<RoomResponse[]>('/room/get-all');

    return response.data;
  }
}