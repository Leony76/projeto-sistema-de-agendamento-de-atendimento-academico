import type { ProfessorAppointmentHistoryResponse, StudentAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";
import { api } from "./api.service";
import type { UserRole } from "@backend/generated/prisma/enums";

export class HistoryService {
  
  public static async getUserAppointmentsHistory<T extends UserRole>(
    userId : number,
    role   : T
  ) {
    const response = await api.get<
      T extends 'STUDENT'
        ? StudentAppointmentHistoryResponse[]
        : ProfessorAppointmentHistoryResponse[]
    >(
      `/history/${role}/${userId}/appointment`
    );

    return response.data;
  }
}