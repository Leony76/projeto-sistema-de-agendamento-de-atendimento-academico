import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { ProfessorAppointmentSolicitationResponse as ProfessorAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";

export const filterStudentSolicitationsFromProfessorView = (
  studentSolicitationsFromProfessorViewData : ProfessorAppointmentSolicitation[],
  searchValue : string,
  filterValue : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'],
): ProfessorAppointmentSolicitation[] => {
  return studentSolicitationsFromProfessorViewData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.student.name.toLowerCase().includes(search) 
      ||
      formatTime(solicitation.dateTime).toLowerCase().includes(search)
      ||
      formatDate(solicitation.dateTime).toLowerCase().includes(search)

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
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

      case 'mostOld':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

      default:
        return 0;
    }
  });
}