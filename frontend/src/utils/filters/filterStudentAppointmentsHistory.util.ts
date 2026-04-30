import { DISCIPLINES_VALUE_MAP } from "@/constants/maps/disciplines.map";
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
      history.professor.name.toLowerCase().includes(search) 
      ||
      history.reason.toLowerCase().includes(search) 
      ||
      DISCIPLINES_VALUE_MAP[history.professor.discipline].toLowerCase().includes(search)
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
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      case 'AZDisciplines':
        return b.professor.discipline.localeCompare(a.professor.discipline);
        
      case 'ZADisciplines':
        return a.professor.discipline.localeCompare(b.professor.discipline);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}