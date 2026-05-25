import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentLastAppointmentResponse } from "@shared/types/dtos/appointment.dto";

type MapperRequestData = {
  dateTime: Date;
  id: number;
  reason: string;
  status: AppointmentStatus;
  room: {
    name: string;
  } | null;
  professor: {
    user: {
      name: string;
    };
  };
}

export const studentLastAppointmentMapper = (
  appointment: MapperRequestData
): StudentLastAppointmentResponse => {
  return {
    id       : appointment.id,
    user     : appointment.professor.user,
    room     : appointment.room?.name ?? '(Sala não encontrada)',
    reason   : appointment.reason,
    status   : appointment.status,
    dateTime : appointment.dateTime.toISOString(),
  }
}