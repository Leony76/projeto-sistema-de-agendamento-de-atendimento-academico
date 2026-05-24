import { AVAILABLE_DAYS_MAP } from "@shared/utils/days.map";
import type { TO_SCHEDULE_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/toScheduleProfessors.map.filter";
import type { AvailableProfessorToScheduleResponse } from "@shared/types/dtos/availableProfessorToSchedule";
import { createFilter } from "./createFilter.util";

export const filterToScheduleProfessors = (
  professorsData: AvailableProfessorToScheduleResponse[],
  searchValue: string,
  filterValue: typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value'],
): AvailableProfessorToScheduleResponse[] => {

  return createFilter(
    professorsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (professor) => professor.name,
        (professor) => professor.disciplines.join(', '),
        (professor) => professor.availableDays
          .map((day) => AVAILABLE_DAYS_MAP[day])
          .join(', ')
        ,
      ],

      filters: {
        includesMonday: (professor) =>
          professor.availableDays.includes('MONDAY'),

        includesTuesday: (professor) =>
          professor.availableDays.includes('TUESDAY'),

        includesWednesday: (professor) =>
          professor.availableDays.includes('WEDNESDAY'),

        includesThursday: (professor) =>
          professor.availableDays.includes('THURSDAY'),

        includesFriday: (professor) =>
          professor.availableDays.includes('FRIDAY'),

        includesSaturday: (professor) =>
          professor.availableDays.includes('SATURDAY'),
      },

      sorts: {
        AZProfessorName: (a, b) =>
          a.name.localeCompare(b.name),

        ZAProfessorName: (a, b) =>
          b.name.localeCompare(a.name),

        AZDisciplines: (a, b) =>
          a.disciplines.join(',')
            .localeCompare(b.disciplines.join(',')),

        ZADisciplines: (a, b) =>
          b.disciplines.join(',')
            .localeCompare(a.disciplines.join(',')),
      },
    },
  );
};