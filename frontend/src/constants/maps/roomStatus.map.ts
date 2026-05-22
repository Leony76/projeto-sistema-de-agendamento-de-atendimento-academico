import type { Room } from "@shared/types/room.type";

export const ROOM_STATUS_MAP: Record<Room['status'], string> = {
  UNAVAILABLE  : 'Indisponível',
  AVAILABLE    : 'Disponível',
}