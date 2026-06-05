import type { ProfessorAppointmentHistoryResponse, StudentAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";
import { api } from "./api.service";
import type { UserRole } from "@backend/generated/prisma/enums";
import type { ApiResponse } from "@shared/types/apiResponse.type";

export class HistoryService {
  
  public static async getUserAppointmentsHistory<T extends Exclude<UserRole, 'MANAGER'>>() {
    const response = await api.get<
      T extends 'STUDENT'
        ? StudentAppointmentHistoryResponse[]
        : ProfessorAppointmentHistoryResponse[]
    >(
      `/history/appointment`
    );

    return response.data;
  }



  public static async removeAppointmentHistory(historyId : number) {

    const response = await api.patch<ApiResponse<{ id: number }>>(
      `/history/${historyId}/remove`
    );

    return response.data;
  }
}