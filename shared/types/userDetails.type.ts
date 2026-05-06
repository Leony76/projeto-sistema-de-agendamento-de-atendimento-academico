import type { ProfessorAppointment, StudentAppointment } from "./appointment.type";
import type { RegisteredStudent, RegisteredManager, RegisteredProfessor } from "./registeredUsers.type";
import type { StudentSolicitation, StudentSolicitationFromProfessorView } from "./solicitation.type";

export type StudentDetails = RegisteredStudent & {
  appointmentsList  : StudentAppointment[];
  solicitationsList : StudentSolicitation[];
  role : 'STUDENT';
};

export type ProfessorDetails = RegisteredProfessor & {
  appointmentsList  : ProfessorAppointment[];
  solicitationsList : StudentSolicitationFromProfessorView[];
  role : 'PROFESSOR';
};

export type ManagerDetails = RegisteredManager & { role : 'MANAGER' };

export type UserDetails = 
  | StudentDetails   
  | ProfessorDetails  
  | ManagerDetails   
;