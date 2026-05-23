import type { STUDENT_APPOINTMENTS_FILTER_MAP } from "@frontend/constants/maps/filters/studentAppoitment.map.filter";
import type { StudentAppointmentResponse as StudentAppointment } from '@shared/types/dtos/appointment.dto';

export const filterStudentAppointments = (
  studentAppoitmentsData : StudentAppointment[],
  searchValue            : string,
  filterValue            : typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value'],
): StudentAppointment[] => {
  
  return studentAppoitmentsData.filter((appointment) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      appointment.professor.name.toLowerCase().includes(search) 
      ||
      appointment.reason.toLowerCase().includes(search)
      ||
      appointment.room?.toLowerCase().includes(search)
      ||
      appointment.dateTime.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'nextOnes':
        return (
          matchesSearch && new Date(appointment.dateTime) > new Date()
        );

      case 'lastOnes':
        return (
          matchesSearch && new Date(appointment.dateTime) < new Date()
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

      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      default:
        return 0;
    }
  });
}