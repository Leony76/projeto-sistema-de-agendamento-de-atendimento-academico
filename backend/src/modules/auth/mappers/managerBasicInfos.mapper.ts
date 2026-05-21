import type { LoginAsGenericResponse, LoginAsManagerResponse } from "@shared/types/dtos/login.type.dto";

type LoginAsManagerRequest = {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  temporaryPassword: boolean;
  createdAt: Date;
};

export const managerBasicInfosMapper = (
  user: LoginAsManagerRequest
): LoginAsManagerResponse => {

  return {
    id                   : user.id,
    name                 : user.name,
    email                : user.email,
    photo                : user.photo ?? '',
    role                 : 'MANAGER',
    hasTemporaryPassword : user.temporaryPassword,
    registeredAt         : user.createdAt.toISOString(),
  };
};