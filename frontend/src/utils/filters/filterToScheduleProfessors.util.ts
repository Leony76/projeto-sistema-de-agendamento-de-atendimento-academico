import { AVAILABLE_DAYS_MAP } from "@frontend/constants/maps/days.map";
import { DISCIPLINES_VALUE_MAP } from "@frontend/constants/maps/disciplines.map";
import type { TO_SCHEDULE_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/toScheduleProfessors.map.filter";
import type { Professor } from "@shared/types/professor.type";

export const filterToScheduleProfessors = (
  professorsData : Professor[],
  searchValue    : string,
  filterValue    : typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value'],
): Professor[] => {
  
  return professorsData.filter((professor) => {
    const search = searchValue.toLowerCase();

    const daysPT = professor.available.days.map(
      (day) => AVAILABLE_DAYS_MAP[day].toLowerCase()
    );

    const hours = professor.available.hours;

    const matchesSearch =
      professor.name.toLowerCase().includes(search) 
      ||
      DISCIPLINES_VALUE_MAP[professor.discipline].toLowerCase().includes(search) 
      ||
      daysPT.some((day) => day.includes(search)) 
      ||
      hours.some((hour) => hour.includes(search))
    ;

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'includesMonday':
        return matchesSearch && professor.available.days.includes('MONDAY');

      case 'includesTuesday':
        return matchesSearch && professor.available.days.includes('TUESDAY');

      case 'includesWednesday':
        return matchesSearch && professor.available.days.includes('WEDNESDAY');

      case 'includesThursday':
        return matchesSearch && professor.available.days.includes('THURSDAY');

      case 'includesFriday':
        return matchesSearch && professor.available.days.includes('FRIDAY');

      case 'includesSaturday':
        return matchesSearch && professor.available.days.includes('SATURDAY');

      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'AZProfessorName':
        return a.name.localeCompare(b.name);

      case 'ZAProfessorName':
        return b.name.localeCompare(a.name);

      case 'AZDisciplines':
        return a.discipline.localeCompare(b.discipline);

      case 'ZADisciplines':
        return b.discipline.localeCompare(a.discipline);

      default:
        return 0;
    }
  });
}