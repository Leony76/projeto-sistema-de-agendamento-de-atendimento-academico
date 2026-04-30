import type { RoomStatus } from "@shared/types/roomStatus.type";

export const ROOM_STATUS_MAP: Record<RoomStatus, string> = {
  RESERVED  : 'Reservado',
  AVAILABLE : 'Disponível',
}