import type { AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';
import { AppointmentRepository } from './appointment.repository';
import { availableProfessorToScheduleMapper } from './mappers/availableProfessorsToScheduleInfos.mapper';
import { DAYS_BY_INDEX_MAP } from '@backend/utils/days.map';
import { generateTimeSlots } from '@backend/utils/generateTimeSlots.util';
import { formatDateToHour } from '@backend/utils/formatDateToHour.util';
import { ApiError } from '@backend/utils/apiError.util';
import type { AppointmentSolicitationRequest, AppointmentSolicitationResponse, UserAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { UserRole } from '@backend/generated/prisma/enums';
import { studentSolicitationsMapper } from './mappers/studentSolicitations.mapper';
import { professorSolicitationsMapper } from './mappers/professorSolicitations.mapper';

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
    data: AppointmentSolicitationRequest
  ): Promise<AppointmentSolicitationResponse> {

    const solicitate = await AppointmentRepository.solicitateAppointment(data);  

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
}