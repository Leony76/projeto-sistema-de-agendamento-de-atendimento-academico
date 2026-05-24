import type { REGISTERED_STUDENTS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveStudentsToManagerList } from "@shared/types/dtos/managerUsersList.dto";
import { createFilter } from "./createFilter.util";
import { formatDate } from "../formats/formatDate.util";
import { formatTime } from "../formats/formatTime.util";

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