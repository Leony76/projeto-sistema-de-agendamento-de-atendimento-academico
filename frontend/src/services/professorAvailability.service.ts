import type { NewProfessorAvailabilityRequest, NewProfessorAvailabilityResponse } from '@shared/types/dtos/newProfessorAvailability.dto';
import { api } from './api.service';
import type { ApiResponse } from '@shared/types/apiResponse.type';

export class ProfessorAvailabilityService {

  public static async defineNewAvailability(
    professorId : number,
    data        : NewProfessorAvailabilityRequest,
  ) {
    const response = await api.post<
      ApiResponse<
        NewProfessorAvailabilityResponse>>
          (`/user/professor/${professorId}/new-availability`, { data }); 
    
    return response.data;
  }
}