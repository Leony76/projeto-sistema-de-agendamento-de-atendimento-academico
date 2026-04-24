import type { ProfessorAppointment } from "@/types/appointment.type";

export const filterProfessorAppointments = (
  professorAppoitmentsData : ProfessorAppointment[],
  searchValue            : string,
  filterValue            : string,
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
      appointment.status.toLowerCase().includes(search)
      ||
      appointment.dateTime.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'confirmed':
        return matchesSearch && appointment.status === 'CONFIRMED';

      case 'unconfirmed':
        return matchesSearch && appointment.status === 'UNCONFIRMED';

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