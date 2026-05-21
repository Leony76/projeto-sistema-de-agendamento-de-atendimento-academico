import { api } from "./api.service";
import { type AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';

export class ScheduleService {

  public static async getAvailableProfessorsToSchedule() {

    const response = await api.get<
      AvailableProfessorToScheduleResponse[]>
        ('/appointment/schedule/available-professors');

    return response.data;
  }

  public static async getProfessorAvailableSlotsToSchedule(id: number, date: Date) {

     const response = await api.get<string[]>(
      `/appointment/schedule/professor/${id}/available-slots`,
      { params: { date: date.toISOString()}},
    );

    return response.data;
  }
}