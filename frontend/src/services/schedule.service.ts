import { api } from "./api.service";
import { type AvailableProfessorToScheduleResponse } from '@shared/types/dtos/availableProfessorToSchedule';
import { type AppointmentSolicitationRequest, type AppointmentSolicitationResponse, type EditAppointmentSolicitationResponse, type ProfessorAppointmentSolicitationResponse, type StudentAppointmentSolicitationResponse } from '@shared/types/dtos/appointmentSolicitation.dto';
import type { ApiResponse } from "@shared/types/apiResponse.type";
import type { UserRole } from "@backend/generated/prisma/enums";
import type { SolicitationDecision } from "@shared/types/solicitationDecision.type";
import type { ProfessorAppointmentResponse, StudentAppointmentResponse } from "@shared/types/dtos/appointment.dto";

export class ScheduleService {

  public static async getAvailableProfessorsToSchedule() {

    const response = await api.get<AvailableProfessorToScheduleResponse[]>(
      '/appointment/schedule/available-professors'
    );

    return response.data;
  }



  public static async getProfessorAvailableSlotsToSchedule(id: number, date: Date) {

     const response = await api.get<string[]>(
      `/appointment/schedule/professor/${id}/available-slots`,
      { params : { 
        date : date.toISOString()}
      },
    );

    return response.data;
  }



  public static async makeAppointmentSolicitation(data: AppointmentSolicitationRequest) {

    const response = await api.post<ApiResponse<AppointmentSolicitationResponse>>(
      `/appointment/schedule/solicitate`, data
    );

    return response.data;
  }

  

  public static async getUserAppointmentSolicitations<T extends Exclude<UserRole, 'MANAGER'>>() {
    
    const response = await api.get<
      T extends 'STUDENT'
        ? StudentAppointmentSolicitationResponse[]
        : ProfessorAppointmentSolicitationResponse[]
    >(
      `/appointment/solicitations`,
    );
    
    return response.data;
  }



  public static async acceptOrDenyAppointmentSolicitation(
    solicitationId : number, 
    decision       : SolicitationDecision
  ) {

    const response = await api.patch<ApiResponse<{decision: SolicitationDecision}>>(
      `/appointment/schedule/solicitation-request/${solicitationId}/${decision}`, 
    );

    return response.data;
  }



  public static async getUserAppointments<T extends UserRole>() {

    const response = await api.get<
      T extends 'STUDENT'
        ? StudentAppointmentResponse[]
        : ProfessorAppointmentResponse[]
    >(`/appointment/`);

    return response.data;
  }



  public static async markAppointmentAsDone(appointmentId: number) {

    const response = await api.patch<ApiResponse<{appointmentId: number}>>(
      `/appointment/${appointmentId}/mark-as-done`
    );

    return response.data;
  }



  public static async markAppointmentAsNoShow(appointmentId: number) {

    const response = await api.patch<ApiResponse<{appointmentId: number}>>(
      `/appointment/${appointmentId}/mark-as-no-show`
    );

    return response.data;
  }



  public static async editAppointment(data: EditAppointmentSolicitationResponse) {

    const response = await api.patch<ApiResponse<EditAppointmentSolicitationResponse>>(
      `/appointment/${data.appointmentId}/edit`,
      data,
    );

    return response.data;
  }



  public static async cancelAppointment(id: number) {

    const response = await api.patch<ApiResponse<{id: number}>>(
      `/appointment/${id}/cancel`,
    );

    return response.data;
  }



  public static async removeSolicitation(id: number) {

    const response = await api.patch<ApiResponse<{id: number}>>(
      `/appointment/solicitation/${id}/remove`,
    );

    return response.data;
  }
}