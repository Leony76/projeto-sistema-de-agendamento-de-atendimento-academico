import type { SystemReportsResponse } from '@shared/types/dtos/systemReports.dto';
import * as Brief from '@shared/types/dtos/userHomeBriefInfos.dto';
import { MiscRepository } from './misc.repository';
import { ApiError } from '@backend/utils/apiError.util';

export class MiscService {

  public static async getSystemReports(): Promise<SystemReportsResponse> {

    const [ 
      appointments, solicitations, rooms, registered 
    ] = await Promise.all([
      MiscRepository.getAppointmentsMetrics(),
      MiscRepository.getSolicitationsMetrics(),
      MiscRepository.getRoomsMetrics(),
      MiscRepository.getUsersMetrics(),
    ]);

    const percentage = (value: number, total: number): number => {
      if (total === 0) return 0;
      return value / total;
    };

    const rate: SystemReportsResponse['rate'] = {
      appointments: {
        attendance   : percentage(appointments.done, appointments.count),
        cancellation : percentage(appointments.canceled, appointments.count),
        withdrawal   : percentage(appointments.noShow, appointments.count),
      },
      solicitations: {
        acceptance : percentage(solicitations.accepted, solicitations.count),
        rejection  : percentage(solicitations.rejected, solicitations.count),
      }
    };
    
    return {
      appointments,
      solicitations,
      registered,
      rooms,
      rate,
    }
  }

  public static async getManagerBriefInfos(): Promise<Brief.ManagerHomeBriefInfosResponse> {

    const brief = await MiscRepository.getManagerBriefInfos();

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das métricas do sistema');
    
    return brief;
  }

  public static async getProfessorBriefInfos(id: number): Promise<Brief.ProfessorHomeBriefInfosResponse> {

    const brief = await MiscRepository.getProfessorBriefInfos(id);

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das suas métricas');
    
    return {
      ...brief,
      nextAppointmentDateTime: brief.nextAppointmentDateTime?.dateTime.toISOString() ?? '',
    };
  }

  public static async getStudentBriefInfos(id: number): Promise<Brief.StudentHomeBriefInfosResponse> {

    const brief = await MiscRepository.getStudentBriefInfos(id);

    if (!brief) throw new ApiError('Não foi possível trazer o resumo das suas métricas');
    
    return brief;
  }
}