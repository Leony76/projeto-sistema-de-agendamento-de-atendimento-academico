import type { StudentSolicitation } from "@shared/types/solicitation.type";

export const STUDENT_SOLICITATIONS_DATA: StudentSolicitation[] = [
  {
    id: 1,
    appoitmentDateTime: '2026-10-05T15:00:00.000Z',
    status: 'UNCONFIRMED',
    professor  : {
      id    : 1, 
      discipline: 'ARTS',
      name  : 'Cloud Strife',
      photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
    },
  },
  {
    id: 2,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CONFIRMED',
    professor  : {
      id    : 2,
      discipline: 'BIOLOGY',
      name  : 'Madara Uchiha',
      photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    }, 
  },
  {
    id: 3,
    appoitmentDateTime: '2026-10-08T17:00:00.000Z',
    status: 'CANCELED',
    professor  : {
      id    : 3,
      discipline: 'BIOLOGY',
      name  : 'Sasuke Uchiha',
      photo : 'https://pop.proddigital.com.br/wp-content/uploads/sites/8/2024/04/01-32.jpg',
    }, 
  },
];