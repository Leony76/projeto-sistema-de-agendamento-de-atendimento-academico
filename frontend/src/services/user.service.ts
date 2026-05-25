import type { ApiResponse } from "@shared/types/apiResponse.type";
import { api } from "./api.service";
import type * as U from '@shared/types/dtos/managerUsersList.dto'; 
import type * as Brief from '@shared/types/dtos/userHomeBriefInfos.dto';
import type { ManagerGeneralInfosResponse, ProfessorGeneralInfosResponse, StudentGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';
import type { AuthUserBasicInfos } from "@shared/types/authUserBasicInfos.type";
import type { UserRole } from "@shared/types/userRole.type";
import type { StudentLastAppointmentResponse } from "@shared/types/dtos/appointment.dto";

export class UserService {

  private static async getActiveUsersToManagerList<T>(role: 'professors' | 'students' | 'managers') {

    const response = await api.get<T>(`/user/manager-list/active-${role}`);

    return response.data;
  }

  private static async getUserGeneralInfosById<T>(role: 'professor' | 'student' | 'manager', id: number) {

    const response = await api.get<T>(`/user/${role}/${id}/general-infos`);

    return response.data;
  }

  private static async getUserHomeBriefInfos<T>(role: 'professor' | 'student' | 'manager', id?: number) {
    let response;

    if (role === 'manager') {
      response = await api.get<T>(`/user/${role}-brief-infos`);
      return response.data;
    }

    response = await api.get<T>(`/user/${role}-brief-infos/${id}`);
    return response.data;
  }

  public static async me(id: number, role: UserRole) {

    const response = await api.get<AuthUserBasicInfos>(`/user/${role}/${id}/me`);

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

  public static async getManagerHomeBriefInfos() {
    return this.getUserHomeBriefInfos<Brief.ManagerHomeBriefInfosResponse>('manager');
  }
  
  public static async getProfessorHomeBriefInfos(id: number) {
    return this.getUserHomeBriefInfos<Brief.ProfessorHomeBriefInfosResponse>('professor', id);
  }
  
  public static async getStudentHomeBriefInfos(id: number) {
    return this.getUserHomeBriefInfos<Brief.StudentHomeBriefInfosResponse>('student', id);
  }

  public static async excludeUsers(ids: number[]) {

    const response = await api.post<ApiResponse<number[]>>(
      '/user/exclude', { ids }
    );

    return response.data;
  }

  public static async changeUserTemporaryPassword(userId: number, newPassword: string) {

    const response = await api.patch<
      ApiResponse<{success: boolean}>>
        (`/user/${userId}/change-temporary-password`, { newPassword });

    return response.data;
  }

  public static async getStudentLastAppointment(id: number) {

    const response = await api.get<StudentLastAppointmentResponse>(
      `/user/student/${id}/last-appointment`
    );

    return response.data;
  }
}