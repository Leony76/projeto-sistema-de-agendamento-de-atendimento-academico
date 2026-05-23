import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { StudentAppointmentSolicitationResponse as StudentAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";

export const filterStudentSolicitations = (
  studentSolicitationsData : StudentAppointmentSolicitation[],
  searchValue              : string,
  filterValue              : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'],
): StudentAppointmentSolicitation[] => {
  return studentSolicitationsData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.professor.name.toLowerCase().includes(search) 
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
      case 'AZProfessorName':
        return a.professor.name.localeCompare(b.professor.name);

      case 'ZAProfessorName':
        return b.professor.name.localeCompare(a.professor.name);

      case 'mostRecent':
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

      case 'mostOld':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

      default:
        return 0;
    }
  });
}