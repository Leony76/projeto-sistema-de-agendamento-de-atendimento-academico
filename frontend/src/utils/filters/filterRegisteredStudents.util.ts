import type { RegisteredStudent } from "@/types/registeredUsers.type";

export const filterRegisteredStudents = (
  registeredStudentsData : RegisteredStudent[],
  searchValue            : string,
  filterValue            : string,
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

    switch (filterValue) {
      case 'nextOnes':
        return (
          matchesSearch 
          &&
          new Date(student.dateTime) > new Date()
        );

      case 'lastOnes':
        return (
          matchesSearch 
          &&
          new Date(student.dateTime) < new Date()
        );

      default:
        return matchesSearch;
    }
  }).sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'mostRecent':
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

      case 'mostOld':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      default:
        return 0;
    }
  });
}