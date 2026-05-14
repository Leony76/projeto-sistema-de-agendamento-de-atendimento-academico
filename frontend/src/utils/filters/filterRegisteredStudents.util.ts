import type { REGISTERED_STUDENTS_FILTER_MAP } from "@frontend/constants/maps/filters/registeredUsers.map.filter";
import type { ActiveStudentsToManagerList } from "@shared/types/dtos/managerUsersList.dto";

export const filterRegisteredStudents = (
  registeredStudentsData : ActiveStudentsToManagerList[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'],
): ActiveStudentsToManagerList[] => {
  
  return registeredStudentsData.filter((student) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(search) 
      ||
      student.email.toLowerCase().includes(search) 
      ||
      student.ra.includes(search) 
      ||
      student.id.toString().includes(search)
      ||
      student.registeredAt.toLowerCase().includes(search)
    ;

    if (!filterValue) return matchesSearch;

    return matchesSearch;
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();

      case 'mostOld':
        return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();

      case 'AZStudentName':
        return a.name.localeCompare(b.name);

      case 'ZAStudentName':
        return b.name.localeCompare(a.name);

      default:
        return 0;
    }
  });
}