import type { UserDetails } from "@shared/types/userDetails.type";

export const REGISTERED_USERS_DATA: UserDetails[] = [
  {
    id            : 1,
    name          : 'Andrine Sampaio Gostosuda',
    photo         : 'https://pbs.twimg.com/media/HHGR31oX0AAjs9t?format=jpg&name=4096x4096',
    registeredAt  : '2026-04-20T15:32:20.000Z',
    appointments  : 2,
    solicitations : 12,
    role          : 'STUDENT',
    appointmentsList : [
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
    ],
    solicitationsList: [
      {
        id: 1,
        professor  : {
          id    : 1, 
          discipline: 'ARTS',
          name  : 'Cloud Strife',
          photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
        },
        appoitmentDateTime: '2026-10-05T15:00:00.000Z',
        status: 'UNCONFIRMED',
      },
      {
        id: 2,
        professor  : {
          id    : 2,
          discipline: 'BIOLOGY',
          name  : 'Madara Uchiha',
          photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
        },         
        appoitmentDateTime: '2026-10-08T17:00:00.000Z',
        status: 'CONFIRMED',
      },
    ],
  },
  {
    id            : 2,
    name          : 'Mad Max',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    appointments  : 233,
    solicitations : 23,
    role          : 'PROFESSOR',
    discipline    : 'GEOGRAPHY',
    appointmentsList : [
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
        student  : {
          id    : 2,   
          name  : 'Maria Bonita Mendonça de Oliveira Lima',
          email : 'mariabonitamedonçadeoliveiralima@aluno.edu.br',
          ra    : 20241180002,
          photo : 'https://pbs.twimg.com/media/HGF5_JeX0AArbDa?format=jpg&name=large',
        },
        reason     : 'Lorem ipsum dolorem ',
        room       : '1C'
      },
    ],
    solicitationsList: [
      {
        id: 1,
        student  : {
          id    : 2,   
          name  : 'Maria Bonita Mendonça de Oliveira Lima',
          email : 'mariabonitamedonçadeoliveiralima@aluno.edu.br',
          ra    : 20241180002,
          photo : 'https://pbs.twimg.com/media/HGF5_JeX0AArbDa?format=jpg&name=large',
        },
        appoitmentDateTime: '2026-10-08T17:00:00.000Z',
        reason: 'Lorem Ipsum Dolor Iurem Eclestas',
        status: 'UNCONFIRMED',
      }
    ],
  },
  {
    id            : 3,
    name          : 'Admin',
    photo         : 'https://www.shutterstock.com/image-vector/admin-stamp-watermark-scratched-style-600w-1138728377.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    role          : 'MANAGER',
  },
];