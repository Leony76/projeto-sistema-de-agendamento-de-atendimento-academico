import type { ApiResponse } from "@shared/types/apiResponse.type";
import { api } from "./api.service";
import type * as U from '@shared/types/dtos/managerUsersList.dto'; 
import type { ManagerGeneralInfosResponse, ProfessorGeneralInfosResponse, StudentGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';

export class UserService {

  private static async getActiveUsersToManagerList<T>(role: 'professors' | 'students' | 'managers') {

    const response = await api.get<T>(`/user/manager-list/active-${role}`);

    return response.data;
  }

  private static async getUserGeneralInfosById<T>(role: 'professor' | 'student' | 'manager', id: number) {

    const response = await api.get<T>(`/user/${role}/${id}/general-infos`);

    return response.data;
  }

  public static async getActiveProfessorsToManagerList() {
    return this.getActiveUsersToManagerList<U.ActiveProfessorsToManagerListResponse[]>('professors');
  }
  
  public static async getActiveStudentsToManagerList() {
    return this.getActiveUsersToManagerList<U.ActiveStudentsToManagerListResponse[]>('students');
  }
  
  public static async getActiveManagersToManagerList() {
    return this.getActiveUsersToManagerList<U.ActiveManagersToManagerListResponse[]>('managers');
  }

  public static async getStudentGeneralInfosById(id: number) {
    return this.getUserGeneralInfosById<StudentGeneralInfosResponse>('student', id);
  }
  
  public static async getProfessorGeneralInfosById(id: number) {
    return this.getUserGeneralInfosById<ProfessorGeneralInfosResponse>('professor', id);
  }
  
  public static async getManagerGeneralInfosById(id: number) {
    return this.getUserGeneralInfosById<ManagerGeneralInfosResponse>('manager', id);
  }

  public static async excludeUsers(ids: number[]) {

    const response = await api.post<ApiResponse<number[]>>('/user/exclude', { ids });

    return response.data;
  }
}