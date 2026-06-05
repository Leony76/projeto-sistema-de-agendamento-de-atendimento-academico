import type { NewProfessorAvailabilityRequest, NewProfessorAvailabilityResponse, ProfessorAvailabilityResponse } from '@shared/types/dtos/newProfessorAvailability.dto';
import { api } from './api.service';
import type { ApiResponse } from '@shared/types/apiResponse.type';

export class ProfessorService {

  public static async defineNewAvailability(
    data : NewProfessorAvailabilityRequest,
  ) {
    const response = await api.post< ApiResponse<NewProfessorAvailabilityResponse>>(
      `/professor/new-availability`, data
    ); 
    
    return response.data;
  }



  public static async getAvailability() {

    const response = await api.get<ProfessorAvailabilityResponse[]>(`/professor/availability`);

    return response.data;
  }
}