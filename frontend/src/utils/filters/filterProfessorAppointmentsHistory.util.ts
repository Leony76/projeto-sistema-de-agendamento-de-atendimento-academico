import type { ProfessorAppointmentHistory } from "@/types/appointmentHistory.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP } from "@/constants/maps/filters/professorAppointmentsHistory.map.filter";

export const filterProfessorAppointmentsHistory = (
  studentAppointmentsHistoryData : ProfessorAppointmentHistory[],
  searchValue              : string,
  filterValue              : typeof PROFESSOR_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'],
): ProfessorAppointmentHistory[] => {
  return studentAppointmentsHistoryData.filter(( history ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      history.name.toLowerCase().includes(search) 
      ||
      history.reason.toLowerCase().includes(search) 
      ||
      formatTime(history.appoitmentDateTime).toLowerCase().includes(search)
      ||
      formatDate(history.appoitmentDateTime).toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'AZStudentName':
        return a.name.localeCompare(b.name);

      case 'ZAStudentName':
        return b.name.localeCompare(a.name);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}