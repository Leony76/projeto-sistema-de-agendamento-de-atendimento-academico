import type { StudentSolicitation } from "@shared/types/solicitation.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";

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
      solicitation.professor.disciplines.some(discipline => discipline.name.toLowerCase().includes(search))
      ||
      formatTime(solicitation.appoitmentDateTime).toLowerCase().includes(search)
      ||
      formatDate(solicitation.appoitmentDateTime).toLowerCase().includes(search)

    if (!filterValue) return matchesSearch;

    switch (filterValue) {
      case 'accepted':
        return matchesSearch && solicitation.status === 'ACCEPTED';

      case 'pending':
        return matchesSearch && solicitation.status === 'PENDING';

      case 'rejected':
        return matchesSearch && solicitation.status === 'REJECTED';

      default:
        return matchesSearch;
    }
  })
  .sort((a, b) => {
    if (!filterValue) return 0;

    const getDisciplinesString = (s: StudentSolicitation) =>
      s.professor.disciplines.map(d => d.name).join(', ')
    ;

    switch (filterValue) {
      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      case 'AZDisciplines':
        return getDisciplinesString(a).localeCompare(getDisciplinesString(b));

      case 'ZADisciplines':
        return getDisciplinesString(b).localeCompare(getDisciplinesString(a));

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}