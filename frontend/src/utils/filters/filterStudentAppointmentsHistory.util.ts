import { DISCIPLINES_MAP } from "@/constants/maps/disciplines.map";
import type { StudentAppointmentHistory } from "@/types/appointmentHistory.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP } from "@/constants/maps/filters/studentAppointmentsHistory.map.filter";

export const filterStudentAppointmentsHistory = (
  studentAppointmentsHistoryData : StudentAppointmentHistory[],
  searchValue              : string,
  filterValue              : typeof STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP[number]['value'],
): StudentAppointmentHistory[] => {
  return studentAppointmentsHistoryData.filter(( history ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      history.name.toLowerCase().includes(search) 
      ||
      history.reason.toLowerCase().includes(search) 
      ||
      DISCIPLINES_MAP[history.discipline].toLowerCase().includes(search)
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
      case 'AZProfessorName':
        return a.name.localeCompare(b.name);

      case 'ZAProfessorName':
        return b.name.localeCompare(a.name);

      case 'AZDisciplines':
        return b.discipline.localeCompare(a.discipline);
        
      case 'ZADisciplines':
        return a.discipline.localeCompare(b.discipline);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}