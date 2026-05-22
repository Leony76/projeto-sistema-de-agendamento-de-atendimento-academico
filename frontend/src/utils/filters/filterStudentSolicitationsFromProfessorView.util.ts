import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { Student } from "@shared/types/userBasicInfos.type";
import type { Appointment } from "@shared/types/appointment.type";

export const filterStudentSolicitationsFromProfessorView = (
  studentSolicitationsFromProfessorViewData : Appointment<Pick<Student, 'name' | 'photo'>>[],
  searchValue : string,
  filterValue : typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'],
): Appointment<Pick<Student, 'name' | 'photo'>>[] => {
  return studentSolicitationsFromProfessorViewData.filter((solicitation) => {
    const search = searchValue.toLowerCase();

    const matchesSearch =
      solicitation.user.name.toLowerCase().includes(search) 
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
        return a.user.name.localeCompare(b.user.name);

      case 'ZAStudentName':
        return b.user.name.localeCompare(a.user.name);

      case 'mostRecent':
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

      case 'mostOld':
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();

      default:
        return 0;
    }
  });
}