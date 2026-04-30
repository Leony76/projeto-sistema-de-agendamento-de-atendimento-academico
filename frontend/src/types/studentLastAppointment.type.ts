import type { StudentAppointment } from "./appointment.type";

export type StudentLastAppointment = Omit<StudentAppointment, 'status' | 'professor'> & {
  professorName: string;
};