import type { Room } from "./room.type";

export type Appointment = {
  readonly id : number;
  dateTime    : string;
  professor   : string;
  reason      : string;
  room        : Room;
  status      : 'UNCONFIRMED' | 'CONFIRMED' | 'CANCELED';
};