import type { SystemReportsResponse } from "@shared/types/dtos/systemReports.dto";
import type * as Brief from '@shared/types/dtos/userHomeBriefInfos.dto';
import { api } from "./api.service";

export class MiscService {

  public static async getSystemReports() {

    const response = await api.get<SystemReportsResponse>('/misc/system-reports');

    return response.data;
  }

  public static async getManagerHomeBriefInfos() {
    
    const response = await api.get<Brief.ManagerHomeBriefInfosResponse>('/misc/manager-brief-infos');

    return response.data;
  }

  public static async getProfessorHomeBriefInfos(id: number) {
    
    const response = await api.get<Brief.ProfessorHomeBriefInfosResponse>(`/misc/professor-brief-infos/${id}`);

    return response.data;
  }

  public static async getStudentHomeBriefInfos(id: number) {
    
    const response = await api.get<Brief.StudentHomeBriefInfosResponse>(`/misc/student-brief-infos/${id}`);

    return response.data;
  }
}