import type { Appointment } from "@shared/types/appointment.type";

export const APPOINTMENTS_DATA: Appointment[] = [
  {
    id          :  1,
    reason      : 'Lorem ipsum dolor 1',
    dateTime    : '2026-10-05T12:00:00.000Z',
    wasDone     : true,
    professorId : 4,
    studentId   : 1,
    roomId      : 1,
  },
  {
    id          :  2,
    reason      : 'Lorem ipsum dolor 2',
    dateTime    : '2026-10-05T13:00:00.000Z',
    wasDone     : false,
    professorId : 5,
    studentId   : 2,
    roomId      : 2,
  },
  {
    id          :  3,
    reason      : 'Lorem ipsum dolor 3',
    dateTime    : '2026-10-05T14:00:00.000Z',
    wasDone     : false,
    professorId : 6,
    studentId   : 3,
    roomId      : 3,
  },
];