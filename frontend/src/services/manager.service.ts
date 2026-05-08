import { api } from "./api.service";
import type { ManagerRegisterUser } from '@shared/types/managerRegisterUser.type'

export class ManagerService {

  public static async registerNewUser(data: ManagerRegisterUser) {
    const response = await api.post<ManagerRegisterUser>('manager/register-new-user', data);

    return response.data;
  };
}