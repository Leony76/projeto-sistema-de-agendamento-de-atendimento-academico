import type { StudentSolicitation, StudentSolicitationFromProfessorView } from "./solicitation.type";

export type StudentAppointmentHistory = Omit<StudentSolicitation, 'status'> & {
  reason : string;
}

export type ProfessorAppointmentHistory = Omit<StudentSolicitationFromProfessorView, 'status'>;