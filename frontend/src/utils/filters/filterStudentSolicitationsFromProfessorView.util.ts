import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import type { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { ProfessorAppointmentSolicitationResponse as ProfessorAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";
import { createFilter } from "./createFilter.util";

export const filterStudentSolicitationsFromProfessorView = (
  studentSolicitationsFromProfessorViewData: ProfessorAppointmentSolicitation[],
  searchValue: string,
  filterValue: typeof STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP[number]['value'],
): ProfessorAppointmentSolicitation[] => {

  return createFilter(
    studentSolicitationsFromProfessorViewData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (solicitation) => solicitation.student.name,
        (solicitation) => formatTime(solicitation.dateTime),
        (solicitation) => formatDate(solicitation.dateTime),
      ],

      filters: {
        accepted: (solicitation) =>
          solicitation.status === 'ACCEPTED',

        pending: (solicitation) =>
          solicitation.status === 'PENDING',

        rejected: (solicitation) =>
          solicitation.status === 'REJECTED',
      },

      sorts: {
        AZStudentName: (a, b) =>
          a.student.name.localeCompare(b.student.name),

        ZAStudentName: (a, b) =>
          b.student.name.localeCompare(a.student.name),

        mostRecent: (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),

        mostOld: (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),

        nextOnes: (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime(),

        lastOnes: (a, b) =>
          new Date(a.dateTime).getTime() -
          new Date(b.dateTime).getTime(),
      },
    },
  );
};