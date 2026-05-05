import type { REGISTERED_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { RegisteredProfessor } from "@shared/types/registeredUsers.type";

export const filterRegisteredProfessors = (
  registeredProfessorsData : RegisteredProfessor[],
  searchValue              : string,
  filterValue              : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'],
): RegisteredProfessor[] => {
  
  return registeredProfessorsData.filter(( professor ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      professor.name.toLowerCase().includes(search) 
      ||
      professor.disciplines.some((discipline) => discipline.name.toLowerCase().includes(search))
      ||
      professor.id.toString().includes(search)
      ||
      professor.registeredAt.toLowerCase().includes(search)
      ||
      professor.solicitations.toString().includes(search)
      ||
      professor.appointments.toString().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    const getDisciplinesString = (professor: RegisteredProfessor) =>
      professor.disciplines.map(discipline => discipline.name).join(', ');

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();

      case 'mostOld':
        return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();

      case 'mostSolicitations':
        return b.solicitations - a.solicitations;

      case 'leastSolicitations':
        return a.solicitations - b.solicitations;

      case 'mostAppointments':
        return b.appointments - a.appointments;

      case 'leastAppointments':
        return a.appointments - b.appointments;

      case 'AZProfessorName':
        return a.name.localeCompare(b.name);

      case 'ZAProfessorName':
        return b.name.localeCompare(a.name);

      case 'AZDisciplineName':
        return getDisciplinesString(a).localeCompare(getDisciplinesString(b));

      case 'ZADisciplineName':
        return getDisciplinesString(b).localeCompare(getDisciplinesString(a));

      default:
        return 0;
    }
  });
}