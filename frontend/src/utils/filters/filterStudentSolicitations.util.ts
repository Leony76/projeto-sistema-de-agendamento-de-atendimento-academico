import type { StudentSolicitation } from "@/types/solicitation.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_SOLICITATIONS_FILTER_MAP } from "@/constants/maps/filters/studentSolicitations.map.filter";

export const filterStudentSolicitations = (
  studentSolicitationsData : StudentSolicitation[],
  searchValue              : string,
  filterValue              : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'],
): StudentSolicitation[] => {
  return studentSolicitationsData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.professor.name.toLowerCase().includes(search) 
      ||
      solicitation.professor.discipline.toLowerCase().includes(search)
      ||
      formatTime(solicitation.appoitmentDateTime).toLowerCase().includes(search)
      ||
      formatDate(solicitation.appoitmentDateTime).toLowerCase().includes(search)

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'confirmed':
        return matchesSearch && solicitation.status === 'CONFIRMED';

      case 'unconfirmed':
        return matchesSearch && solicitation.status === 'UNCONFIRMED';

      case 'canceled':
        return matchesSearch && solicitation.status === 'CANCELED';

      default:
        return matchesSearch;
    }
  })
  .sort((a, b) => {
    if (!filterValue) return 0;

    switch (filterValue) {
      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      case 'AZDisciplines':
        return b.professor.discipline.localeCompare(a.professor.discipline);
        
      case 'ZADisciplines':
        return a.professor.discipline.localeCompare(b.professor.discipline);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}