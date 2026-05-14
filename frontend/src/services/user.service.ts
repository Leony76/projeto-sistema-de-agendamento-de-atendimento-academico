import { api } from "./api.service";
import type * as U from '@shared/types/dtos/managerUsersList.dto'; 

export class UserService {

  public static async getActiveProfessorsToManagerList() {

    const response = await api.get<U.ActiveProfessorsToManagerListResponse[]>('/user/manager-list/active-professors');

    return response.data;
  }

  public static async getActiveStudentsToManagerList() {

    const response = await api.get<U.ActiveStudentsToManagerListResponse[]>('/user/manager-list/active-students');

    return response.data;
  }

  public static async getActiveManagersToManagerList() {

    const response = await api.get<U.ActiveManagersToManagerListResponse[]>('/user/manager-list/active-managers');

    return response.data;
  }
}