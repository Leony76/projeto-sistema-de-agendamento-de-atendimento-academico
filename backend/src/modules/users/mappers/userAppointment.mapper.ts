import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { Appointment } from "@shared/types/appointment.type";
import type { StudentGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";

export type UserAppointment = {
  id       : number;
  reason   : string;
  dateTime : Date;
  status   : AppointmentStatus;
  room     : {
    name : string;
  } | null;
  entity    : {
    user: {
      name  : string;
    };
  };
};

export const userAppointmentMapper = (
  appointment: UserAppointment
): Appointment<{ name: string }> => {

  return {
    id       : appointment.id,
    reason   : appointment.reason,
    room     : appointment.room?.name ?? null,
    status   : appointment.status,
    dateTime : appointment.dateTime.toISOString(),
    user: {
      name  : appointment.entity.user.name,
    },
  };
};