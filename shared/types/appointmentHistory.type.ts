import type { StudentSolicitation, StudentSolicitationFromProfessorView } from "./solicitation.type";

export type AppointmentHistory = {
  readonly id            : number;
  readonly appointmentId : number;
  registeredAt           : string;
}

export type StudentAppointmentHistory = Omit<StudentSolicitation, 'status'> & {
  reason : string;
}

export type ProfessorAppointmentHistory = Omit<StudentSolicitationFromProfessorView, 'status'>;