import type { StudentAppointment } from "./appointment.type";
import type { Professor } from "./professor.type";

export type StudentSolicitation = Omit<Professor, 'available'> & {
  status : StudentAppointment['status'];
  appoitmentDateTime : string;
}

export type StudentSolicitationFromProfessorView = Omit<StudentSolicitation, 'discipline'> & {
  reason: string;
};