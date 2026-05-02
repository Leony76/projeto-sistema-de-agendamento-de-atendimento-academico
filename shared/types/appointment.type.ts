import type { Professor } from "./professor.type";
import type { Student } from "./student.type";

export type Appointment = {
  readonly id          : number; 
  readonly studentId   : number;
  readonly professorId : number;
  readonly roomId      : number;

  wasDone              : boolean;

  dateTime    : string;
  reason      : string;
}

export type StudentAppointment = {
  readonly id : number;
  dateTime    : string;
  reason      : string;
  room        : string;
  professor   : Omit<Professor, 'available'>;
};

export type ProfessorAppointment = Omit<StudentAppointment, 'professor'> & {
  student: Student;
};