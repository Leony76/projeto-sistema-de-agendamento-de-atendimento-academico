import type { AppointmentStatus } from "./appointmentStatus.type";
import type { Professor } from "./professor.type";
import type { Student } from "./student.type";

export type Solicitation = {
  readonly id : number;
  readonly studentId : number;
  readonly professorId : number;
  status      : AppointmentStatus;
  appoitmentDateTime : string;
}

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