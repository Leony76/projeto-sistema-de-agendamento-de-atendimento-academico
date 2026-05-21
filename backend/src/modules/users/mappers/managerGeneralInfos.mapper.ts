import type { ManagerGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";

type ManagerGenralInfos = {
  user: {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
}

export const managerGeneralInfosMapper = (
  { user }: ManagerGenralInfos 
): ManagerGeneralInfosResponse => {
  return {
    email        : user.email,
    id           : user.id,
    name         : user.name,
    photo        : user.photo,
    registeredAt : user.createdAt.toISOString(),
    role         : 'MANAGER', 
  }
};