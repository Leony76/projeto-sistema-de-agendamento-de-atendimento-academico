import type { UserRole } from "@backend/generated/prisma/enums";
import type { UserAppointmentHistoryResponse } from '@shared/types/dtos/appointmentHistory.dto';
import { HistoryRepository } from "./history.repository";
import { ApiError } from "@backend/utils/apiError.util";
import { professorAppointmentsHistoryMapper } from "./mapper/professorAppointmentHistory.mapper";
import { studentAppointmentsHistoryMapper } from "./mapper/studentAppointmentHistory.mapper";

export class HistoryService {

  public static async getUserAppointmentsHistory(
    role : UserRole, 
    id   : number
  ): Promise<UserAppointmentHistoryResponse[]> {
    const apiError = 'Não foi possível trazer seu histórico de atendimentos feitos. Tente novamente mais tarde!';

    switch (role) {
      case 'STUDENT':
        const studentAppointmentsHistory = await HistoryRepository.getStudentAppointmentsHistory(id);
        if (!studentAppointmentsHistory) throw new ApiError(apiError);
        return studentAppointmentsHistoryMapper(studentAppointmentsHistory);
      default: 
        const professorAppointmentsHistory = await HistoryRepository.getProfessorAppointmentsHistory(id);
        if (!professorAppointmentsHistory) throw new ApiError(apiError);
        return professorAppointmentsHistoryMapper(professorAppointmentsHistory);
    }
  }
}