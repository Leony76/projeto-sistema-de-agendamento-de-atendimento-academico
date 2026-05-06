import type { StudentAppointmentHistory } from "@shared/types/appointmentHistory.type"
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_APPOINTMENTS_HISTORY_FILTER_MAP } from "@frontend/constants/maps/filters/studentAppointmentsHistory.map.filter";
import type { Professor } from "@shared/types/professor.type";
import type { Discipline } from "@shared/types/disciplines.type";

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
      history.professor.disciplines.some((discipline) => discipline.name.toLowerCase().includes(search))
      ||
      formatTime(history.appoitmentDateTime).toLowerCase().includes(search)
      ||
      formatDate(history.appoitmentDateTime).toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    const getDisciplinesString = (professor: Professor & { disciplines: Discipline[]}) =>
      professor.disciplines.map(discipline => discipline.name).join(', ');

    switch (filterValue) {
      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      case 'AZDisciplines':
        return getDisciplinesString(a.professor).localeCompare(getDisciplinesString(b.professor));

      case 'ZADisciplines':
        return getDisciplinesString(b.professor).localeCompare(getDisciplinesString(a.professor));

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}