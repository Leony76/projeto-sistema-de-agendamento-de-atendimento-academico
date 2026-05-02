import type { AppointmentStatus } from "./appointmentStatus.type";
import { Discipline } from "./disciplines.type";
import type { Professor } from "./professor.type";
import type { Student } from "./student.type";

export type Solicitation = {
  readonly id          : number;
  readonly studentId   : number;
  readonly professorId : number;

  reason             : string;
  status             : AppointmentStatus;
  appoitmentDateTime : string;
}

export type StudentSolicitation = { 
  readonly id : number;
  professor   : Professor & { disciplines: Discipline[] };
  status      : AppointmentStatus;
  reason      : string;
  appoitmentDateTime : string;
}

export type StudentSolicitationFromProfessorView = Omit<StudentSolicitation, 'discipline' | 'professor'> & {
  student : Student;
  reason  : string;
};