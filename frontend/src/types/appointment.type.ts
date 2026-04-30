import type { AppointmentStatus } from "./appointmentStatus.type";
import type { Professor } from "./professor.type";
import type { Student } from "./Student.type";

export type StudentAppointment = {
  readonly id : number;
  dateTime    : string;
  reason      : string;
  room        : string;
  status      : AppointmentStatus;
  professor   : Omit<Professor, 'available'>;
};

export type ProfessorAppointment = Omit<StudentAppointment, 'professor'> & {
  student: Student;
};