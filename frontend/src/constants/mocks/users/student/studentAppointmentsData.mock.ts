import type { StudentAppointment } from "@/types/appointment.type";

export const STUDENT_APPOITMENTS_DATA: StudentAppointment[] = [
  {
    id         :  1,
    dateTime   : '2026-10-05T15:00:00.000Z',
    reason     : 'Lorem ipsum dolor ',
    room       : '1B',
    professor  : {
      id    : 1, 
      discipline: 'ARTS',
      name  : 'Cloud Strife',
      photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
    },
  },
  {
    id         :  2,
    dateTime   : '2026-10-07T16:00:00.000Z',
    reason     : 'Lorem ipsum dolorem ',
    room       : '1C',
    professor  : {
      id    : 2,
      discipline: 'BIOLOGY',
      name  : 'Madara Uchiha',
      photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    },
  },
  {
    id         :  3,
    dateTime   : '2026-10-09T16:00:00.000Z',
    reason     : 'Lorem ipsum dolorem ashdashd',
    room       : '4A',
    professor  : {
      id    : 3,
      discipline: 'BIOLOGY',
      name  : 'Sasuke Uchiha',
      photo : 'https://pop.proddigital.com.br/wp-content/uploads/sites/8/2024/04/01-32.jpg',
    },
  },
];