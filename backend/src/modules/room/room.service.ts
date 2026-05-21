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
      const base = {
        id     : room.id,
        name   : room.name,
        status : room.status,
      };

      if (room.status !== 'RESERVED') {
        return base;
      }

      const currentAppointment = room.appointments[0];

      if (!currentAppointment) {
        return {
          ...base,
          status: 'AVAILABLE',
        };
      }

      return {
        ...base,
        status: 'RESERVED',
        appointmentDate:
          currentAppointment.dateTime.toISOString(),
        occupants: {
          student:
            currentAppointment.student.user.name,
          professor:
            currentAppointment.professor.user.name,
        },
      };
    });
  }
}