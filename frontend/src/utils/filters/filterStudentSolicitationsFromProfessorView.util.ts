import type { StudentSolicitationFromProfessorView } from "@shared/types/solicitation.type";
import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";

export const filterStudentSolicitationsFromProfessorView = (
  studentSolicitationsFromProfessorViewData : StudentSolicitationFromProfessorView[],
  searchValue : string,
  filterValue : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'],
): StudentSolicitationFromProfessorView[] => {
  return studentSolicitationsFromProfessorViewData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.student.name.toLowerCase().includes(search) 
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

    switch (filterValue) {
      case 'AZStudentName':
        return a.student.name.localeCompare(b.student.name);

      case 'ZAStudentName':
        return b.student.name.localeCompare(a.student.name);

      case 'mostRecent':
        return new Date(b.appoitmentDateTime).getTime() - new Date(a.appoitmentDateTime).getTime();

      case 'mostOld':
        return new Date(a.appoitmentDateTime).getTime() - new Date(b.appoitmentDateTime).getTime();

      default:
        return 0;
    }
  });
}