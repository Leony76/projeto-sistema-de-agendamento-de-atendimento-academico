import type { ProfessorAppointment, StudentAppointment } from "./appointment.type";
import type { RegisteredStudent, RegisteredManager, RegisteredProfessor } from "./registeredUsers.type";
import type { StudentSolicitation, StudentSolicitationFromProfessorView } from "./solicitation.type";

export type UserDetails = 
  | RegisteredStudent & {
  role              : 'STUDENT';
  appointmentsList  : StudentAppointment[];
  solicitationsList : StudentSolicitation[];
} | RegisteredProfessor & {
  role              : 'PROFESSOR';
  appointmentsList  : ProfessorAppointment[];
  solicitationsList : StudentSolicitationFromProfessorView[];
} | RegisteredManager & {
  role : 'MANAGER';
};