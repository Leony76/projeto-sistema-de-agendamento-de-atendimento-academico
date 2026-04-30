import type { ProfessorAppointment } from "@shared/types/appointment.type";

export const PROFESSOR_APPOITMENTS_DATA: ProfessorAppointment[] = [
  {
    id         :  1,
    dateTime   : '2026-10-05T15:00:00.000Z',
    reason     : 'Lorem ipsum dolor ',
    room       : '1B',
    student  : {
      id    : 1,   
      name  : 'Andrine Sampaio Gostosuda',
      email : 'andrinesampaiogostosuda@aluno.edu.br',
      ra    : 20241180001,
      photo : 'https://pbs.twimg.com/media/HHGR31oX0AAjs9t?format=jpg&name=4096x4096' ,
    },
  },
  {
    id         :  2,
    dateTime   : '2026-10-07T16:00:00.000Z',
    reason     : 'Lorem ipsum dolorem horem ipsum dolorem porem ipsu',
    room       : '1C',
    student  : {
      id    : 2,   
      name  : 'Maria Bonita Mendonça de Oliveira Lima',
      email : 'mariabonitamedonçadeoliveiralima@aluno.edu.br',
      ra    : 20241180002,
      photo : 'https://pbs.twimg.com/media/HGF5_JeX0AArbDa?format=jpg&name=large',
    },
  },
  {
    id         :  2,
    dateTime   : '2026-10-07T16:00:00.000Z',
    reason     : 'Lorem ipsum dolorem horem ipsum dolorem porem ipsu',
    room       : '1C',
    student  : {
      id    : 3,   
      name  : 'Maria Clara Vidal Melo',
      email : 'mariaclaravidalmelo@aluno.edu.br',
      ra    : 20241180003,
      photo : 'https://pbs.twimg.com/media/HG7-qkMXEAAWEiU?format=jpg&name=large',
    },
  },
];