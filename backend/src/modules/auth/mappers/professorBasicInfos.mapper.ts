import type { LoginAsGenericResponse, LoginAsProfessorResponse } from "@shared/types/dtos/login.type.dto";

type LoginAsProfessorRequest = {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  hasTemporaryPassword: boolean;
  createdAt: Date;

  professor: {
    disciplines: {
      name: string;
    }[];
  } | null;
};

export const professorBasicInfosMapper = (
  user: LoginAsProfessorRequest
): LoginAsProfessorResponse => {

  return {
    id                   : user.id,
    name                 : user.name,
    email                : user.email,
    photo                : user.photo ?? '',
    role                 : 'PROFESSOR',
    hasTemporaryPassword : user.hasTemporaryPassword,
    registeredAt         : user.createdAt.toISOString(),

    disciplines:
      user.professor?.disciplines.map(
        (discipline) => discipline.name
      ) ?? [],
  };
};