import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type Appointment<T> = {
  readonly id : number;
  dateTime    : string;
  reason      : string;
  status      : AppointmentStatus;
  room        : string | null;
  user        : T; 
};
