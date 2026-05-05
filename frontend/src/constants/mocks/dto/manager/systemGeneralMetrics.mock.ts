import { SOLICITATIONS_DATA } from '../../data/solicitations.mock';
import { APPOINTMENTS_DATA } from '../../data/appointments.mock';
import { PROFESSORS } from '../../data/professors.mock';
import { STUDENTS } from '../../data/students.mock';
import type { SystemGeneralMetrics } from '@shared/types/systemGeneralMetrics.type';

const systemGeneralMetrics = (): SystemGeneralMetrics['count'] => {

  const count: SystemGeneralMetrics['count'] = {
    student       : STUDENTS.length,
    professors    : PROFESSORS.length,
    appointments  : APPOINTMENTS_DATA.length,
    solicitations : SOLICITATIONS_DATA.length,
  };
  
  return count;
};

export const SYSTEM_GENERAL_METRICS = systemGeneralMetrics();