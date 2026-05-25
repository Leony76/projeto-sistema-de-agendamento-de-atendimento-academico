import type { Room } from "@shared/types/room.type";

export const ROOM_STATUS_MAP: Record<Room['status'] | 'RESERVED', string> = {
  UNAVAILABLE  : 'Indisponível',
  RESERVED     : 'Reservada',
  AVAILABLE    : 'Disponível',
}