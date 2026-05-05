import type { Room } from '@shared/types/room.type';
import { PROFESSORS } from './professors.mock';
import { STUDENTS } from './students.mock';

export const ROOMS: Room[] = [
  {
    id: 1,
    name: '1A',
    status: 'RESERVED',
    appointmentDate: '2026-10-05T14:48:00.000Z',
    occupants: {
      professor : PROFESSORS.at(0)?.name ?? 'Professor',
      student   : STUDENTS.at(0)?.name ?? 'Aluno',
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
    appointmentDate: '2026-10-05T14:48:00.000Z',
    occupants: {
      professor : PROFESSORS.at(1)?.name ?? 'Professor',
      student   : STUDENTS.at(2)?.name ?? 'Aluno',
    },
  },
];