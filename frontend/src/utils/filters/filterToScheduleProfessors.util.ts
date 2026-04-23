import type { Professor } from "@/types/professor.type";

export const filterToScheduleProfessors = (
  professorsData : Professor[],
  searchValue    : string,
  filterValue    : string,
): Professor[] => {
  
  return professorsData.filter((professor) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      professor.name.toLowerCase().includes(search) 
      ||
      professor.discipline.toLowerCase().includes(search)
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