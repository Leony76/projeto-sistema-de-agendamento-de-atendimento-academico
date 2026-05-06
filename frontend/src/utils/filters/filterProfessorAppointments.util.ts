import type { PROFESSOR_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/professorAppointments.map.filter";
import type { ProfessorAppointment } from "@shared/types/appointment.type";

export const filterProfessorAppointments = (
  professorAppoitmentsData : ProfessorAppointment[],
  searchValue            : string,
  filterValue            : typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'],
): ProfessorAppointment[] => {
  
  return professorAppoitmentsData.filter((appointment) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      appointment.student.name.toLowerCase().includes(search) 
      ||
      appointment.reason.toLowerCase().includes(search)
      ||
      appointment.room.toLowerCase().includes(search)
      ||
      appointment.dateTime.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'nextOnes':
        return (
          matchesSearch 
          &&
          new Date(appointment.dateTime) > new Date()
        );

      case 'lastOnes':
        return (
          matchesSearch 
          &&
          new Date(appointment.dateTime) < new Date()
        );

      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

      case 'mostOld':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

      case 'AZStudentName':
        return a.student.name.localeCompare(b.student.name);

      case 'ZAStudentName':
        return b.student.name.localeCompare(a.student.name);
      

      default:
        return 0;
    }
  });
}