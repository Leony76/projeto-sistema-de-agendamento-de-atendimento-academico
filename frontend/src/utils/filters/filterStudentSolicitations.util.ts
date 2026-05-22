import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { Appointment } from "@shared/types/appointment.type";
import type { Professor } from "@shared/types/userBasicInfos.type";

export const filterStudentSolicitations = (
  studentSolicitationsData : Appointment<Pick<Professor, 'name' | 'photo' | 'disciplines'>>[],
  searchValue              : string,
  filterValue              : typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'],
): Appointment<Pick<Professor, 'name' | 'photo' | 'disciplines'>>[] => {
  return studentSolicitationsData.filter((solicitation) => {
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
      case 'AZProfessorName':
        return a.user.name.localeCompare(b.user.name);

      case 'ZAProfessorName':
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