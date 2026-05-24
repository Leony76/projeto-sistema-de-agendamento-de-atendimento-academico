import type { StudentAppointmentHistoryResponse as StudentAppointmentHistory } from "@shared/types/dtos/appointmentHistory.dto"; 
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP } from "@frontend/constants/maps/filters/userAppointmentHistory.map.filter";
import { createFilter } from "./createFilter.util";

export const filterStudentAppointmentsHistory = (
  studentAppointmentsHistoryData : StudentAppointmentHistory[],
  searchValue                    : string,
  filterValue                    : typeof STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'],
): StudentAppointmentHistory[] => {

  const getDisciplinesString = (disciplines: string[]) =>
    disciplines.join(', ');

  return createFilter(
    studentAppointmentsHistoryData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (history) => formatDate(history.dateTime),
        (history) => formatTime(history.dateTime),
        (history) => history.id.toString(),
        (history) => history.professor.name,
        (history) => history.status,
        (history) => history.reason,
        (history) => history.room,
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        mostOld: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),

        AZProfessorName: (a, b) => a.professor.name.localeCompare(b.professor.name),

        ZAProfessorName: (a, b) => b.professor.name.localeCompare(a.professor.name),

        AZDisciplines: (a, b) =>
          getDisciplinesString(a.professor.disciplines).localeCompare(
            getDisciplinesString(b.professor.disciplines)
          ,
        ),

        ZADisciplines: (a, b) =>
          getDisciplinesString(b.professor.disciplines).localeCompare(
            getDisciplinesString(a.professor.disciplines)
          ,
        ),
      }
    },
  );
}