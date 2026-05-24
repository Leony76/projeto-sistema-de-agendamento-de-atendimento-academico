import type { ProfessorAppointmentHistoryResponse as ProfessorAppointmentHistory } from "@shared/types/dtos/appointmentHistory.dto";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointmentHistory.map.filter";
import { createFilter } from "./createFilter.util";

export const filterProfessorAppointmentsHistory = (
  studentAppointmentsHistoryData : ProfessorAppointmentHistory[],
  searchValue              : string,
  filterValue              : typeof PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'],
): ProfessorAppointmentHistory[] => {

  return createFilter(
    studentAppointmentsHistoryData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (history) => history.student.name,
        (history) => history.reason,
        (history) => formatTime(history.dateTime),
        (history) => formatDate(history.dateTime),
      ],

      sorts: {
        AZStudentName: (a, b) =>
          a.student.name.localeCompare(b.student.name),

        ZAStudentName: (a, b) =>
          b.student.name.localeCompare(a.student.name),

        mostRecent: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        mostOld: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(), 
      }
    },
  );
}