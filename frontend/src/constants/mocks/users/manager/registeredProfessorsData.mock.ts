import type { RegisteredProfessor } from "@/types/registeredUsers.type";

export const REGISTERED_PROFESSORS_DATA: RegisteredProfessor[] = [
  {
    id            : 2,
    name          : 'Mad Max',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-22T15:32:20.000Z',
    appointments  : 2,
    solicitations : 12,
    discipline    : 'CHEMISTRY' 
  },
  {
    id            : 4,
    name          : 'Fred Mercury',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-23T15:32:20.000Z',
    appointments  : 20,
    solicitations : 15,
    discipline    : 'ARTS' 
  },
  {
    id            : 5,
    name          : 'Indiana Jones',
    photo         : 'https://d2d7ho1ae66ldi.cloudfront.net/ArquivoNoticias/4d41e027-17d6-11ef-aa78-d602bea5d5c0/mad-max.jpg',
    registeredAt  : '2026-04-24T15:32:20.000Z',
    appointments  : 25,
    solicitations : 10,
    discipline    : 'PHYSICS' 
  },
];