import type { Appointment } from "@/types/appointment.type";

export const filterStudentAppointments = (
  studentAppoitmentsData : Appointment[],
  searchValue            : string,
  filterValue            : string,
): Appointment[] => {
  
  return studentAppoitmentsData.filter((appointment) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      appointment.professor.name.toLowerCase().includes(search) 
      ||
      appointment.reason.toLowerCase().includes(search)
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

      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      default:
        return 0;
    }
  });
}