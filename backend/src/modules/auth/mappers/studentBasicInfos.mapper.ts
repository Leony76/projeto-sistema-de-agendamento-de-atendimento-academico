import type { UserRole } from "@backend/generated/prisma/enums";
import type { LoginAsStudentResponse } from "@shared/types/dtos/login.type.dto";
import type { StudentRegistersHimselfResponse } from "@shared/types/dtos/register.type.dto";

type LoginAsStudentRequest = {
  user: {
    email: string;
    hasTemporaryPassword: boolean;
    id: number;
    name: string;
    photo: string | null;
    createdAt: Date;
    role: UserRole;
    password: string;
  };
  ra: string;
};

export const studentBasicInfosMapper = (student: LoginAsStudentRequest): LoginAsStudentResponse => {
  return {
    email                : student.user.email,
    hasTemporaryPassword : student.user.hasTemporaryPassword,
    id                   : student.user.id,
    name                 : student.user.name,
    photo                : student.user.photo ?? '',
    ra                   : student.ra,
    registeredAt         : student.user.createdAt.toISOString(),
    role                 : 'STUDENT',
  };
}


type SelfRegistredStudentRequest = {
  name: string;
  email: string;
  hasTemporaryPassword: boolean;
  photo: string | null;
  createdAt: Date;
  role: UserRole;
  student: {
    ra: string;
  } | null;
  id: number;
}

export const studentBasicInfosFromRegistrationMapper = (user: SelfRegistredStudentRequest): StudentRegistersHimselfResponse => {
  return {
    email                : user.email,
    id                   : user.id,
    name                 : user.name,
    photo                : user.photo ?? '',
    ra                   : user.student?.ra!,
    hasTemporaryPassword : user.hasTemporaryPassword,
    registeredAt         : user.createdAt.toISOString(),
    role                 : 'STUDENT',
  };
}