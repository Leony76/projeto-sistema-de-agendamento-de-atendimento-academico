import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "@frontend/constants/maps/filters/studentSolicitations.map.filter";
import type { StudentAppointmentSolicitationResponse as StudentAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";
import { createFilter } from "./createFilter.util";

export const filterStudentSolicitations = (
  studentSolicitationsData: StudentAppointmentSolicitation[],
  searchValue: string,
  filterValue: typeof STUDENT_SOLICITATIONS_FILTER_MAP[number]['value'],
): StudentAppointmentSolicitation[] => {

  return createFilter(
    studentSolicitationsData,
    searchValue,
    filterValue,
    {
      searchFields: [
        (solicitation) => solicitation.professor.name,

        (solicitation) =>
          formatTime(solicitation.dateTime),

        (solicitation) =>
          formatDate(solicitation.dateTime),
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
        AZProfessorName: (a, b) =>
          a.professor.name.localeCompare(b.professor.name),

        ZAProfessorName: (a, b) =>
          b.professor.name.localeCompare(a.professor.name),

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