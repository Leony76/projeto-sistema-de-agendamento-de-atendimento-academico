import type { Appointment } from "./appointment.type";
import type { Professor } from "./professor.type";

export type Solicitation = Omit<Professor, 'available'> & {
  status : Appointment['status'];
  appoitmentDateTime : string;
}