import { APPOITMENT_FILTER_MAP } from "./filters/appoitment.map.filter";
import { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP } from "./filters/studentAppointmentsHistory.map.filter";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "./filters/studentSolicitations.map.filter";
import { TO_SCHEDULE_PROFESSORS_FILTER_MAP } from "./filters/toScheduleProfessors.map.filter";

export const SELECT_OPTIONS_SCHEMA_MAP = {
  APPOINTMENT_FILTER                  : APPOITMENT_FILTER_MAP,
  TO_SCHEDULE_PROFESSORS_FILTER       : TO_SCHEDULE_PROFESSORS_FILTER_MAP,
  STUDENT_SOLICITATIONS_FILTER        : STUDENT_SOLICITATIONS_FILTER_MAP,
  STUDENT_APPOINTMENTS_HISTORY_FILTER : STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP,
} as const;