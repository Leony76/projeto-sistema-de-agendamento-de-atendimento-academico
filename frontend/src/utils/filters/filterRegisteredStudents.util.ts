import type { REGISTERED_STUDENTS_FILTER_MAP } from "@/constants/maps/filters/registeredUsers.map.filter";
import type { RegisteredStudent } from "@/types/registeredUsers.type";

export const filterRegisteredStudents = (
  registeredStudentsData : RegisteredStudent[],
  searchValue            : string,
  filterValue            : typeof REGISTERED_STUDENTS_FILTER_MAP[number]['value'],
): RegisteredStudent[] => {
  
  return registeredStudentsData.filter((student) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(search) 
      ||
      student.id.toString().includes(search)
      ||
      student.registeredAt.toLowerCase().includes(search)
      ||
      student.solicitations.toString().includes(search)
      ||
      student.appointments.toString().includes(search)
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

      case 'mostSolicitations':
        return b.solicitations - a.solicitations;

      case 'leastSolicitations':
        return a.solicitations - b.solicitations;

      case 'mostAppointments':
        return b.appointments - a.appointments;

      case 'leastAppointments':
        return a.appointments - b.appointments;

      case 'AZStudentName':
        return a.name.localeCompare(b.name);

      case 'ZAStudentName':
        return b.name.localeCompare(a.name);

      default:
        return 0;
    }
  });
}