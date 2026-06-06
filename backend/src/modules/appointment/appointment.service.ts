import type { AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';
import { AppointmentRepository } from './appointment.repository';
import { availableProfessorToScheduleMapper } from './mappers/availableProfessorsToScheduleInfos.mapper';
import { DAYS_BY_INDEX_MAP } from '@backend/utils/days.map';
import { generateTimeSlots } from '@backend/utils/generateTimeSlots.util';
import { formatDateToHour } from '@backend/utils/formatDateToHour.util';
import { ApiError } from '@backend/utils/apiError.util';
import type { AppointmentSolicitationRequest, AppointmentSolicitationResponse, EditAppointmentSolicitationResponse, UserAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { UserRole } from '@backend/generated/prisma/enums';
import { studentSolicitationsMapper } from './mappers/studentSolicitations.mapper';
import { professorSolicitationsMapper } from './mappers/professorSolicitations.mapper';
import type { SolicitationDecision } from '@shared/types/solicitationDecision.type';
import type { UserAppointmentResponse } from '@shared/types/dtos/appointment.dto';
import { studentAppointmentsMapper } from './mappers/studentAppointments.mapper';
import { professorAppointmentsMapper } from './mappers/professorAppointments.mapper';

export class AppointmentService {

  public static async getAvailableProfessorsToSchedule(): Promise<AvailableProfessorToScheduleResponse[]> {

    const availableProfessors = await AppointmentRepository.getAvailableProfessorsToSchedule();  

    return availableProfessors.map(availableProfessorToScheduleMapper);
  }



  public static async getProfessorAvailableSlots(
    professorId : number,
    date        : Date,
  ): Promise<string[]> {

    const professor = await AppointmentRepository.getProfessorAvailabilityAndAppointments(
      professorId,
      date,
    );

    if (!professor) 
      throw new ApiError('Professor não encontrado', 404);
    
    const dayOfWeek = DAYS_BY_INDEX_MAP[date.getDay()];

    const availability = professor.availability.filter(
      (a) => a.dayOfWeek === dayOfWeek
    );

    if (availability.length === 0) return [];

    const occupiedSlots = professor.appointments.map(
      (appointment) => formatDateToHour(appointment.dateTime)
    );

    const availableSlots: string[] = [];

    for (const shift of availability) {
      const slots = generateTimeSlots(
        shift.startTime,
        shift.endTime,
      );

      const freeSlots = slots.filter(
        (slot) => !occupiedSlots.includes(slot)
      );

      availableSlots.push(...freeSlots);
    }

    return availableSlots.sort();
  }



  public static async solicitateAppointment(
    data      : AppointmentSolicitationRequest,
    studentId : number,
  ): Promise<AppointmentSolicitationResponse> {

    const solicitate = await AppointmentRepository.solicitateAppointment(data, studentId);  

    return {
      dateTime      : solicitate.dateTime.toISOString(),
      professorName : solicitate.professor.user.name,
      reason        : solicitate.reason,
    }
  }



  public static async getUserSolicitations(role: UserRole, id: number): Promise<UserAppointmentSolicitationResponse[]> {
    switch (role) {
      case 'PROFESSOR': 
        const professorSolicitations = await AppointmentRepository.getProfessorSolicitations(id);
        return professorSolicitationsMapper(professorSolicitations);
      default:  
        const studentSolicitations = await AppointmentRepository.getStudentSolicitations(id);
        return studentSolicitationsMapper(studentSolicitations);
    }
  }



  public static async acceptOrDenyAppointmentSolicitation(
    solicitationId : number,
    decision       : SolicitationDecision
  ): Promise<{ decision: SolicitationDecision }> {
    switch (decision) {
      case 'ACCEPTED':
        await AppointmentRepository.acceptAppointmentSolicitation(solicitationId);
        break;
      case 'REJECTED':
        const response = await AppointmentRepository.rejectAppointmentSolicitation(solicitationId);
        if (!response) throw new ApiError('Não foi possível rejeitar essa solicitação, pois ela não existe!', 404);
        break;
    }

    return { decision };
  }


  
  public static async getUserAppointments(
    userId : number,
    role   : UserRole
  ): Promise<UserAppointmentResponse[]> {
    const apiError = 'Não foi possível trazer sua agenda de encontros, pois ela não foi encontrada!';

    switch (role) {
      case 'PROFESSOR':
        const professorAppointments = await AppointmentRepository.getProfessorAppointments(userId);
        if (!professorAppointments)  throw new ApiError(apiError, 404);
        return professorAppointmentsMapper(professorAppointments);
      default:
        const studentAppointments = await AppointmentRepository.getStudentAppointments(userId);
        if (!studentAppointments) throw new ApiError(apiError, 404);
        return studentAppointmentsMapper(studentAppointments);
    }
  }



  public static async markAppointmentAsDone(appointmentId: number): Promise<{appointmentId: number}> {

    const appointment = await AppointmentRepository.getAppointmentStatusAndRoomIdById(appointmentId);

    if (!appointment?.roomId)
        throw new ApiError('Não foi possível marcar o atendimento como concluído. Tente novamente mais tarde!', 500);

    if (appointment.status === 'DONE')
        throw new ApiError('Atendimento já foi concluído.', 409);

    const markAsDone = await AppointmentRepository.markAppointmentAsDone(appointmentId, appointment.roomId);
    
    return { appointmentId: markAsDone.id };
  }



  public static async markAppointmentAsNoShow(appointmentId: number): Promise<{appointmentId: number}> {

    const appointment = await AppointmentRepository.getAppointmentStatusAndRoomIdById(appointmentId);

    if (!appointment?.roomId)
        throw new ApiError('Não foi possível marcar o atendimento como aluno não comparecido. Tente novamente mais tarde!', 500);

    if (appointment.status === 'NO_SHOW')
        throw new ApiError('Atendimento já foi marcado como aluno não comparecido', 409);

    const markAsNoShow = await AppointmentRepository.markAppointmentAsNoShow(appointmentId, appointment.roomId);
    
    return { appointmentId: markAsNoShow.id };
  }
  


  public static async editAppointment(
    data: EditAppointmentSolicitationResponse
  ): Promise<EditAppointmentSolicitationResponse> {

    const exist = await AppointmentRepository.findAppointmentById(data.appointmentId);

    if (!exist) 
      throw new ApiError('Houve um erro ao editar a solicitação, pois a mesma não existe!', 404);

    const edited = await AppointmentRepository.editAppointment(data);
    
    return {
      dateTime      : edited.dateTime.toISOString(),
      reason        : edited.reason,
      appointmentId : edited.id,
    };
  }



  public static async cancelAppointment(id: number): Promise<{id: number}> {

    const [exist, alreadyCanceled] = await Promise.all([
      AppointmentRepository.findAppointmentById(id),
      AppointmentRepository.isSolicitationAlreadyCanceled(id),
    ]); 

    if (!exist) 
      throw new ApiError('Houve um erro ao cancelar a solicitação, pois a mesma não existe!', 404);
    if (alreadyCanceled) 
      throw new ApiError('Houve um erro ao cancelar a solicitação, pois a mesma já estava!', 409);

    const canceled = await AppointmentRepository.cancelAppointment(id);
    
    return { id: canceled.id };
  }



  public static async removeSolicitation(id: number): Promise<{id: number}> {

    const [exist, alreadyRemoved] = await Promise.all([
      AppointmentRepository.findAppointmentById(id),
      AppointmentRepository.isSolicitationAlreadyRemoved(id),
    ]); 

    if (!exist) 
      throw new ApiError('Houve um erro ao remover a solicitação, pois a mesma não existe!', 404);
    if (alreadyRemoved) 
      throw new ApiError('Houve um erro ao remover a solicitação, pois a mesma já está!', 409);

    const removed = await AppointmentRepository.removeSolicitation(id);
    
    return { id: removed.id };
  }
}