import type { Professor } from "./professor.type";
import type { Student } from "./Student.type";

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