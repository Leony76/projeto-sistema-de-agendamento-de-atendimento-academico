import type { Solicitation } from "@shared/types/solicitation.type";

export const SOLICITATIONS_DATA: Solicitation[] = [
  {
    id: 1,
    studentId: 1,
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    status: 'UNCONFIRMED',
    professorId: 4,
  },
  {
    id: 2,
    studentId: 2,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CONFIRMED',
    professorId: 5, 
  },
  {
    id: 3,
    studentId: 3,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CANCELED',
    professorId: 6, 
  },
];