import type { AppointmentStatus } from "./appointmentStatus.type";
import type { Room } from "./room.type";

export type Appointment = {
  readonly id : number;
  dateTime    : string;
  reason      : string;
  room        : Room;
  status      : AppointmentStatus;
  professor   : {
    name  : string;
    photo : string;
  };
};