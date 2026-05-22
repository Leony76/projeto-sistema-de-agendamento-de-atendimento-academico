import { ApiError } from "@backend/utils/apiError.util";
import { RoomRepository } from "./room.repository";
import type { RoomResponse } from '@shared/types/dtos/room.dto';

export class RoomService {

  public static async addRoom(name: string): Promise<string> {

    const roomAlreadyExists = await RoomRepository.roomAlreadyExists(name);

    if (roomAlreadyExists)
      throw new ApiError('Não foi possível adicionar a sala, pois ela já existe', 409);
    
    const newRoom = await RoomRepository.addRoom(name);

    return newRoom.name;
  }

  public static async getAll(): Promise<RoomResponse[]> {

    const rooms = await RoomRepository.getRooms();

    return rooms.map((room) => {

      const appointments = room.appointments.map((appointment) => ({
        dateTime: appointment.dateTime.toISOString(),
        occupants: {
          student: appointment.student.user.name,
          professor: appointment.professor.user.name,
        }
      }));

      return {
        id: room.id,
        name: room.name,
        status: room.status,
        ...(appointments.length > 0 && {
          appointments
        }),
      };
    });
  }
}