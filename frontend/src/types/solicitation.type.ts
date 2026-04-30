import type { AppointmentStatus } from "./appointmentStatus.type";
import type { Professor } from "./professor.type";
import type { Student } from "./Student.type";

export type StudentSolicitation = { 
  readonly id : number;
  professor   : Omit<Professor, 'available'>;
  status      : AppointmentStatus;
  appoitmentDateTime : string;
}

export type StudentSolicitationFromProfessorView = Omit<StudentSolicitation, 'discipline' | 'professor'> & {
  student : Student;
  reason  : string;
};