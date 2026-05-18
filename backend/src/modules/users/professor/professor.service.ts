import type { NewProfessorAvailabilityRequest, NewProfessorAvailabilityResponse, ProfessorAvailabilityResponse } from "@shared/types/dtos/newProfessorAvailability.dto";
import { UserRepository } from "../user.repository";
import { ApiError } from "@backend/utils/apiError.util";
import { ProfessorRepository } from "./professor.repository";
import type { ProfessorAvailability } from "@shared/types/professorAvailability.type";
import { validateShiftHours } from "@backend/utils/validateShiftHours.util";

export class ProfessorService {

  private static async userExists(id: number, notFoundMessage: string) {
    const userExists = await UserRepository.findUserById(id);
  
    if (!userExists) throw new ApiError(notFoundMessage);
  }

  public static async defineNewAvailability(
    professorId : number,
    data        : NewProfessorAvailabilityRequest, 
  ): Promise<NewProfessorAvailabilityResponse['dayOfWeek'][]> {

    this.userExists(professorId, 'Não foi possível definir sua disponibilidade. Tente novamente mais tarde!')
    
    const morningError = validateShiftHours(data.shift.MORNING, 'manhã');
    if (morningError) throw new ApiError(morningError);

    const afternoonError = validateShiftHours(data.shift.AFTERNOON, 'tarde');
    if (afternoonError) throw new ApiError(afternoonError);

    const newAvailability = await ProfessorRepository.newAvailability(professorId, data);
    
    return newAvailability.map((a) => a.dayOfWeek);
  }
  
  public static async getAvailability(professorId: number): Promise<ProfessorAvailabilityResponse[]> {
    
    await this.userExists(professorId, 'Não foi possível trazer seus horários de disponibilidade');
    
    const professorAvailability = await ProfessorRepository.getAvailability(professorId);

    const groupedAvailability = new Map<
      ProfessorAvailability['dayOfWeek'],
      ProfessorAvailabilityResponse
    >();

    for (const availability of professorAvailability) {
      if (!groupedAvailability.has(availability.dayOfWeek)) {
        groupedAvailability.set(availability.dayOfWeek, {
          dayOfWeek: availability.dayOfWeek,
          shift: {
            MORNING: {
              start: '',
              end: '',
            },
            AFTERNOON: {
              start: '',
              end: '',
            },
          },
        });
      }

      const currentDay = groupedAvailability.get(availability.dayOfWeek)!;

      currentDay.shift[availability.shift] = {
        start : String(availability.startTime),
        end   : String(availability.endTime),
      };
    }

    return Array.from(groupedAvailability.values());
  }
}