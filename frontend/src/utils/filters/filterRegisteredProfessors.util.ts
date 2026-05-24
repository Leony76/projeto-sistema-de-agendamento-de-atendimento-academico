import type { REGISTERED_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveProfessorsToManagerList } from "@shared/types/dtos/managerUsersList.dto";
import { createFilter } from "./createFilter.util";
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";

export const filterRegisteredProfessors = (
  registeredProfessorsData : ActiveProfessorsToManagerList[],
  searchValue              : string,
  filterValue              : typeof REGISTERED_PROFESSORS_FILTER_MAP[number]['value'],
): ActiveProfessorsToManagerList[] => {
  
  const getDisciplinesString = (disciplines: string[]) =>
    disciplines.join(', ');

  return createFilter(
    registeredProfessorsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (professor) => professor.email,
        (professor) => professor.id.toString(),
        (professor) => professor.disciplines.join(', '),
        (professor) => professor.name,
        (professor) => formatDate(professor.registeredAt),
        (professor) => formatTime(professor.registeredAt),
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime(),

        AZProfessorName: (a, b) => a.name.localeCompare(b.name),

        ZAProfessorName: (a, b) => b.name.localeCompare(a.name),

        AZDisciplines: (a, b) =>
          getDisciplinesString(a.disciplines).localeCompare(
            getDisciplinesString(b.disciplines)
          ,
        ),

        ZADisciplines: (a, b) =>
          getDisciplinesString(b.disciplines).localeCompare(
            getDisciplinesString(a.disciplines)
          ,
        ),
      }
    },
  );
}