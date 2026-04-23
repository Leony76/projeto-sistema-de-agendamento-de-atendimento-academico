import type { AppointmentHistory } from "@/types/appointmentHistory.type";

export const filterStudentAppointmentsHistory = (
  studentAppointmentsHistoryData : AppointmentHistory[],
  searchValue              : string,
  filterValue              : string,
): AppointmentHistory[] => {
  return studentAppointmentsHistoryData.filter(( history ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      history.name.toLowerCase().includes(search) ||
      history.discipline.toLowerCase().includes(search);

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