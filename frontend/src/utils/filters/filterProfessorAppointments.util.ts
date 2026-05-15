import type { PROFESSOR_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/professorAppointments.map.filter";
import type { Appointment } from "@shared/types/appointment.type";
import type { Student } from "@shared/types/userBasicInfos.type";

export const filterProfessorAppointments = (
  professorAppoitmentsData : Appointment<Pick<Student, 'name' | 'photo'>>[],
  searchValue            : string,
  filterValue            : typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'],
): Appointment<Pick<Student, 'name' | 'photo'>>[] => {
  
  return professorAppoitmentsData.filter((appointment) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      appointment.user.name.toLowerCase().includes(search) 
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
        return a.user.name.localeCompare(b.user.name);

      case 'ZAStudentName':
        return b.user.name.localeCompare(a.user.name);
      

      default:
        return 0;
    }
  });
}