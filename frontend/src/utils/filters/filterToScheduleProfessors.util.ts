import { AVAILABLE_DAYS_MAP } from "@shared/utils/days.map";
import type { TO_SCHEDULE_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/toScheduleProfessors.map.filter";
import type { AvailableProfessorToScheduleResponse } from "@shared/types/dtos/availableProfessorToSchedule";

export const filterToScheduleProfessors = (
  professorsData : AvailableProfessorToScheduleResponse[],
  searchValue    : string,
  filterValue    : typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value'],
): AvailableProfessorToScheduleResponse[] => {

  return professorsData.filter((professor) => {
    const search = searchValue.toLowerCase();

    const daysPT = professor.availableDays.map((day) =>
      AVAILABLE_DAYS_MAP[day].toLowerCase()
    );

    const matchesSearch =
      professor.name.toLowerCase().includes(search) ||
      professor.disciplines.some((d) =>
        d.toLowerCase().includes(search)
      ) ||
      daysPT.some((day) => day.includes(search))

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'includesMonday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'MONDAY')
        );

      case 'includesTuesday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'TUESDAY')
        );

      case 'includesWednesday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'WEDNESDAY')
        );

      case 'includesThursday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'THURSDAY')
        );

      case 'includesFriday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'FRIDAY')
        );

      case 'includesSaturday':
        return (
          matchesSearch &&
          professor.availableDays.some((day) => day === 'SATURDAY')
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