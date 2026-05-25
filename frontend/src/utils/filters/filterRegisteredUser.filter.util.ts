import type { REGISTERED_STUDENTS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveStudentsToManagerList } from "@shared/types/dtos/managerUsersList.dto";
import { createFilter } from "./createFilter.util";
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";
import type { REGISTERED_PROFESSORS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveProfessorsToManagerList } from "@shared/types/dtos/managerUsersList.dto";
import type { REGISTERED_MANAGERS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveManagersToManagerList } from "@shared/types/dtos/managerUsersList.dto";

// -----> STUDENT

export const filterRegisteredStudents = (
  registeredStudentsData : ActiveStudentsToManagerList[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'],
): ActiveStudentsToManagerList[] => {
  
  return createFilter(
    registeredStudentsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (student) => student.email,
        (student) => student.id.toString(),
        (student) => student.name,
        (student) => student.ra,
        (student) => formatDate(student.registeredAt),
        (student) => formatTime(student.registeredAt),
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime(),

        AZStudentName: (a, b) => a.name.localeCompare(b.name),
        
        ZAStudentName: (a, b) => b.name.localeCompare(a.name),
      },
    }
  );
}

// -----> PROFESSOR

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

// -----> MANAGER

export const filterRegisteredManagers = (
  registeredManagersData : ActiveManagersToManagerList[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_MANAGERS_FILTER_MAP[number]['value'],
): ActiveManagersToManagerList[] => {

  return createFilter(
    registeredManagersData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (manager) => manager.email,
        (manager) => manager.id.toString(),
        (manager) => manager.name,
        (manager) => formatDate(manager.registeredAt),
        (manager) => formatTime(manager.registeredAt),
      ],

      sorts: {
        mostRecent: (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime(),
      }
    },
  );
}