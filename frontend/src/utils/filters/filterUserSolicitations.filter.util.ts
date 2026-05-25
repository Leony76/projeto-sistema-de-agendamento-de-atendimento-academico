import { formatTime } from "../formats/formatTime.util";
import { formatDate } from "../formats/formatDate.util";
import { STUDENT_SOLICITATIONS_FILTER_MAP } from "@frontend/constants/maps/filters/userSolicitations.map.filter";
import type { StudentAppointmentSolicitationResponse as StudentAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";
import type { STUDENT_SOLICITATIONS_FROM_PROFESSOR_VIEW_FILTER_MAP } from "@frontend/constants/maps/filters/userSolicitations.map.filter";
import type { ProfessorAppointmentSolicitationResponse as ProfessorAppointmentSolicitation } from "@shared/types/dtos/appointmentSolicitation.dto";
import { createFilter } from "./createFilter.util";

// -----> STUDENT

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
        (solicitation) => solicitation.reason,
        (solicitation) => solicitation.status,
        (solicitation) => solicitation.id.toString(),
        (solicitation) => solicitation.professor.disciplines.join(', '),
        (solicitation) =>formatTime(solicitation.dateTime),
        (solicitation) =>formatDate(solicitation.dateTime),
        (appointment) => formatDate(appointment.updatedAt),
        (appointment) => formatTime(appointment.updatedAt),
      ],

      filters: {
        accepted: (solicitation) =>
          solicitation.status === 'ACCEPTED',

        pending: (solicitation) =>
          solicitation.status === 'PENDING',

        rejected: (solicitation) =>
          solicitation.status === 'REJECTED',

        canceled: (solicitation) =>
          solicitation.status === 'CANCELED',

        confirmed: (solicitation) =>
          solicitation.status === 'CONFIRMED',
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

// -----> PROFESSOR

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
        (solicitation) => solicitation.reason,
        (solicitation) => solicitation.status,
        (solicitation) => solicitation.id.toString(),
        (solicitation) =>formatTime(solicitation.dateTime),
        (solicitation) =>formatDate(solicitation.dateTime),
        (appointment) => formatDate(appointment.updatedAt),
        (appointment) => formatTime(appointment.updatedAt),
      ],

      filters: {
        accepted: (solicitation) =>
          solicitation.status === 'ACCEPTED',

        pending: (solicitation) =>
          solicitation.status === 'PENDING',

        rejected: (solicitation) =>
          solicitation.status === 'REJECTED',

        canceled: (solicitation) =>
          solicitation.status === 'CANCELED',

        confirmed: (solicitation) =>
          solicitation.status === 'CONFIRMED',
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