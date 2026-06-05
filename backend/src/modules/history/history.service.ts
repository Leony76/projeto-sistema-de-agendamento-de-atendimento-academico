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



  public static async removeAppointmentHistory(
    id     : number, 
    userId : number,
    role   : Exclude<UserRole, 'MANAGER'>
  ): Promise<{id: number}> {
    
    const [exists, alreadyRemoved] = await Promise.all([
      HistoryRepository.findAppointmentHistoryById(id),
      HistoryRepository.isAppointmentHistoryAlreadyRemoved(id, role),
    ]); 

    if (!exists)
      throw new ApiError('Houve um erro ao remover o histórico do atendimento, pois ele não existe!', 404);
    if (alreadyRemoved)
      throw new ApiError('Houve um erro ao remover o histórico do atendimento, pois ele já está removido!', 409);
    if (role === 'STUDENT' && exists.appointment.studentId !== userId) 
      throw new ApiError('Você não tem permissão para remover este histórico.', 403);
    if (role === 'PROFESSOR' && exists.appointment.professorId !== userId) 
      throw new ApiError('Você não tem permissão para remover este histórico.', 403);
     

    const response = await HistoryRepository.removeAppointmentHistory(id, role); 

    return { id: response.id };
  }
}