import type { Reports } from "@shared/types/reports.type";

export const SYSTEM_REPORTS_DATA: Reports = {
  appointments: {
    canceled   : 23,
    confirmed : 123,
    count     : 146
  },
  rate: {
    appointments: {
      attendance : 0.67,
      withdrawal : 0.12,
    },
    solicitations: {
      acceptance : 0.97,
      rejection  : 0.03, 
    },
  },
  registered: {
    managers   : 1,
    professors : 12,
    students   : 233,
  },
  rooms: {
    available : 12,
    reserved  : 2,
  },
  solicitations: {
    count    : 133,
    accepted : 123,
    rejected : 12,
  },
};