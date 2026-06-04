import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentLastAppointmentResponse } from "@shared/types/dtos/appointment.dto";

type MapperRequestData = {
  room: {
    name: string;
  };
  appointment: {
    id: number;
    reason: string;
    dateTime: Date;
    status: AppointmentStatus;
    professor: {
      user: {
        name: string;
      };
    };
  };
}

export const studentLastAppointmentMapper = (
  { appointment, room }: MapperRequestData
): StudentLastAppointmentResponse => {
  return {
    id       : appointment.id,
    user     : appointment.professor.user,
    room     : room?.name ?? '(Sala não encontrada)',
    reason   : appointment.reason,
    status   : appointment.status,
    dateTime : appointment.dateTime.toISOString(),
  }
}