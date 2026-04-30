import type { RoomDetails } from "@shared/types/roomStatus.type";

export const SYSTEM_ROOMS_DATA: RoomDetails[] = [
  {
    id: 1,
    name: '1A',
    status: 'RESERVED',
    appointmentDate: '2026-04-28T15:00:00.000Z',
    occupants: {
      student   : 'Andrine Sampaio Gostosuda',
      professor : 'Madara Uchiha',
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
      student   : 'Maria Bonita Mendonça de Oliveira Lima',
      professor : 'Sasuke Uchiha',
    },
  },
];