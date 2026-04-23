import type { Solicitation } from "./solicitation.type";

export type AppointmentHistory = Omit<Solicitation, 'status'> & {
  reason : string;
}