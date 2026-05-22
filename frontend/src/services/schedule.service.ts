import { api } from "./api.service";
import { type AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';
import { type AppointmentSolicitationRequest, type AppointmentSolicitationResponse, type UserAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { UserRole } from "@backend/generated/prisma/enums";

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

  public static async makeAppointmentSolicitation(data: AppointmentSolicitationRequest) {

    const response = await api.post<ApiResponse<AppointmentSolicitationResponse>>(
      `/appointment/schedule/solicitate`, data
    );

    return response.data;
  }

  public static async getUserAppointmentSolicitations(role: UserRole, id: number) {

    const response = await api.get<UserAppointmentSolicitationResponse[]>(
      `/appointment/${role}/${id}/solicitations`,
    );

    return response.data;
  }
}