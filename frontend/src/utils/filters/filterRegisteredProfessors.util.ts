import type { REGISTERED_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveProfessorsToManagerList } from "@shared/types/dtos/managerUsersList.dto";

export const filterRegisteredProfessors = (
  registeredProfessorsData : ActiveProfessorsToManagerList[],
  searchValue              : string,
  filterValue              : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'],
): ActiveProfessorsToManagerList[] => {
  
  return registeredProfessorsData.filter(( professor ) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      professor.name.toLowerCase().includes(search) 
      ||
      professor.disciplines.some((discipline) => discipline.toLowerCase().includes(search))
      ||
      professor.id.toString().includes(search)
      ||
      professor.registeredAt.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    const getDisciplinesString = (professor: ActiveProfessorsToManagerList) =>
      professor.disciplines.map(discipline => discipline).join(', ');

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();

      case 'mostOld':
        return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    
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