import { StudentAppointment } from "./appointment.type";
import { StudentSolicitation } from "./solicitation.type";

export type Student = {
  readonly id  : number;
  name         : string;
  photo        : string;
  email        : string;
  ra           : number;
  registeredAt : string;
};