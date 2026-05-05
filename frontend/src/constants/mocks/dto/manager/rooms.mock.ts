import type { Room } from "@shared/types/room.type";
import { ROOMS } from "../../data/rooms.mock";

export const ROOMS_DETAILS: Room[] = ROOMS.map((room) => {

  const roomData: Room = room.status === 'RESERVED' 
    ? { ...room } : {
      id     : room.id,
      name   : room.name,
      status : room.status,
    }
  ;

  return roomData;
});