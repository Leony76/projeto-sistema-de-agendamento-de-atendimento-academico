import type { SystemReportsResponse } from '@shared/types/dtos/systemReports.dto';
import { MiscRepository } from './misc.repository';

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
}