import type { Appointment } from "./appointment.type";

export type StudentLastAppointment = Omit<Appointment, 'status' | 'professor'> & {
  professorName: string;
};