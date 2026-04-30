import type { RoomDetails } from "@/types/roomStatus.type";

export const SYSTEM_ROOMS_DATA: RoomDetails[] = [
  {
    id: 1,
    name: '1A',
    status: 'RESERVED',
    appointmentDate: '2026-04-28T15:00:00.000Z',
    occupants: {
      student   : 'Leony Leandro Barros',
      professor : 'Cícero Tadeu Pereira Lima França',
    },
  },
  {
    id: 2,
    name: '2B',
    status: 'AVAILABLE',
  },
  {
    id: 3,
    name: '3C',
    status: 'RESERVED',
    appointmentDate: '2026-04-29T15:00:00.000Z',
    occupants: {
      student   : 'Henrique Sampáio',
      professor : 'Cícero Tadeu Pereira Lima França',
    },
  },
];