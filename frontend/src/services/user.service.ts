import type { ApiResponse } from "@shared/types/apiResponse.type";
import { api } from "./api.service";
import type { ActiveManagersToManagerListResponse, ActiveProfessorsToManagerListResponse, ActiveStudentsToManagerListResponse } from '@shared/types/dtos/managerUsersList.dto'; 
import type * as Brief from '@shared/types/dtos/userHomeBriefInfos.dto';
import type { ManagerGeneralInfosResponse, ProfessorGeneralInfosResponse, StudentGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';
import type { AuthUserBasicInfos } from "@shared/types/authUserBasicInfos.type";
import type { UserRole } from "@shared/types/userRole.type";
import type { StudentLastAppointmentResponse } from "@shared/types/dtos/appointment.dto";

export class UserService {

  
  public static async me() {

    const response = await api.get<AuthUserBasicInfos>(`/user/me`);

    return response.data;
  }



  public static async getActiveUsersToManagerList<
    T extends Lowercase<UserRole>
  >( role: T ) {

    const response = await api.get<
      T extends 'student'
        ? ActiveStudentsToManagerListResponse[]
      : T extends 'professor'
        ?  ActiveProfessorsToManagerListResponse[]
        : ActiveManagersToManagerListResponse[]
    >(`/user/manager-list/active-${role}`);

    return response.data;
  }



  public static async getUserHomeBriefInfos<T extends UserRole>() {

    const response = await api.get<
      T extends 'STUDENT'
        ? Brief.StudentHomeBriefInfosResponse
      : T extends 'PROFESSOR'
        ? Brief.ProfessorHomeBriefInfosResponse
        : Brief.ManagerHomeBriefInfosResponse
    >(`/user/user-brief-infos`);

    return response.data;
  }



  public static async getUserGeneralInfosById<T extends Lowercase<UserRole>> (
    role : T, 
    id   : number
  ) {

    const response = await api.get<
      T extends 'student'
        ? StudentGeneralInfosResponse
      : T extends 'professor'
        ? ProfessorGeneralInfosResponse
        : ManagerGeneralInfosResponse
    >(`/user/${role}/${id}/general-infos`);

    return response.data;
  }


  
  public static async excludeUsers(ids: number[]) {

    const response = await api.post<ApiResponse<number[]>>(
      '/user/exclude', { ids }
    );

    return response.data;
  }



  public static async changeUserTemporaryPassword(newPassword: string) {

    const response = await api.patch<ApiResponse<{success: boolean}>>(
      `/user/change-temporary-password`, { newPassword }
    );

    return response.data;
  }



  public static async getStudentLastAppointment() {

    const response = await api.get<StudentLastAppointmentResponse>(
      `/user/student/last-appointment`
    );

    return response.data;
  }
}