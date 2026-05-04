import type { Solicitation } from "@shared/types/solicitation.type";

export const SOLICITATIONS_DATA: Solicitation[] = [
  {
    id: 1,
    studentId: 1,
    professorId: 3,
    reason: 'Lorem ipsum dolor 1',
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    status: 'CANCELED',
  },
  {
    id: 2,
    studentId: 2,
    professorId: 5, 
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    reason : 'Lorem ipsum dolor 2',
    status: 'CONFIRMED',
  },
  {
    id: 3,
    studentId: 3,
    professorId: 6, 
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    reason : 'Lorem ipsum dolor 3',
    status: 'CANCELED',
  },
];