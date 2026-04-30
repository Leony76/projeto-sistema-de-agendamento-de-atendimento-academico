import type { ProfessorAppointmentHistory } from "@shared/types/appointmentHistory.type";

export const PROFESSOR_APPOINTMENT_HISTORY_DATA: ProfessorAppointmentHistory[] = [
  {
    id: 1,
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    reason: 'Lorem Ipsum Dolor Iurem Eclestas',
    student  : {
      id    : 1,   
      name  : 'Andrine Sampaio Gostosuda',
      email : 'andrinesampaiogostosuda@aluno.edu.br',
      ra    : 20241180001,
      photo : 'https://pbs.twimg.com/media/HHGR31oX0AAjs9t?format=jpg&name=4096x4096' ,
    },
  },
  {
    id: 2,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    reason: 'Lorem Ipsum Dolor Iure Eclestas Joramentia caestus',
    student  : {
      id    : 2,   
      name  : 'Maria Bonita Mendonça de Oliveira Lima',
      email : 'mariabonitamedonçadeoliveiralima@aluno.edu.br',
      ra    : 20241180002,
      photo : 'https://pbs.twimg.com/media/HGF5_JeX0AArbDa?format=jpg&name=large',
    },
  },
  {
    id: 3,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    reason: 'Lorem ipsum dolor',
    student  : {
      id    : 3,   
      name  : 'Maria Clara Vidal Melo',
      email : 'mariaclaravidalmelo@aluno.edu.br',
      ra    : 20241180003,
      photo : 'https://pbs.twimg.com/media/HG7-qkMXEAAWEiU?format=jpg&name=large',
    },
  },
];