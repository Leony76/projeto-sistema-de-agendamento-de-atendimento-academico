import { AVAILABLE_DAYS_MAP } from "@frontend/constants/maps/days.map";
import type { TO_SCHEDULE_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/toScheduleProfessors.map.filter";
import type { ToScheduleProfessors } from "@shared/types/toScheduleProfessors.type";

export const filterToScheduleProfessors = (
  professorsData : ToScheduleProfessors[],
  searchValue    : string,
  filterValue    : typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value'],
): ToScheduleProfessors[] => {

  return professorsData.filter((professor) => {
    const search = searchValue.toLowerCase();

    const daysPT = professor.availability.map((a) =>
      AVAILABLE_DAYS_MAP[a.dayOfWeek].toLowerCase()
    );

    const hours = professor.availability.map((a) => {
      const start = `${Math.floor(a.startHour / 60)
        .toString()
        .padStart(2, '0')}:${(a.startHour % 60)
        .toString()
        .padStart(2, '0')}`
      ;

      const end = `${Math.floor(a.endHour / 60)
        .toString()
        .padStart(2, '0')}:${(a.endHour % 60)
        .toString()
        .padStart(2, '0')}`
      ;

      return `${start} - ${end}`;
    });

    const matchesSearch =
      professor.name.toLowerCase().includes(search) ||
      professor.disciplines.some((d) =>
        d.toLowerCase().includes(search)
      ) ||
      daysPT.some((day) => day.includes(search)) ||
      hours.some((hour) => hour.includes(search));

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'includesMonday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'MONDAY')
        );

      case 'includesTuesday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'TUESDAY')
        );

      case 'includesWednesday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'WEDNESDAY')
        );

      case 'includesThursday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'THURSDAY')
        );

      case 'includesFriday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'FRIDAY')
        );

      case 'includesSaturday':
        return (
          matchesSearch &&
          professor.availability.some((a) => a.dayOfWeek === 'SATURDAY')
        );

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
        return a.disciplines.join(',').localeCompare(b.disciplines.join(','));

      case 'ZADisciplines':
        return b.disciplines.join(',').localeCompare(a.disciplines.join(','));

      default:
        return 0;
    }
  });
};