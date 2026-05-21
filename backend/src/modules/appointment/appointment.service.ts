import type { AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';
import { AppointmentRepository } from './appointment.repository';
import { availableProfessorToScheduleMapper } from './mappers/availableProfessorsToScheduleInfos.mapper';
import { DAYS_BY_INDEX_MAP } from '@backend/utils/days.map';
import { generateTimeSlots } from '@backend/utils/generateTimeSlots.util';
import { formatDateToHour } from '@backend/utils/formatDateToHour.util';
import { ApiError } from '@backend/utils/apiError.util';

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
}