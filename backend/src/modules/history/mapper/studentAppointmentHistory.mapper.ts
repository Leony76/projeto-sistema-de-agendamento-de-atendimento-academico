import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";

type MapperRequestData = {
  appointment: {
    id       : number;
    reason   : string;
    dateTime : Date;
    registeredAt: Date,
    updatedAt: Date,
    status   : AppointmentStatus;
    room     : {
      name: string;
    } | null;
    professor: {
      user: {
        name  : string;
        photo : string | null;
      };
      disciplines: {
        name : string;
      }[];
    };
  };
}

export const studentAppointmentsHistoryMapper = (
  data: MapperRequestData[]
): StudentAppointmentHistoryResponse[] => {
  return data.map(({ appointment }) => ({
    dateTime  : appointment.dateTime.toISOString(),
    id        : appointment.id,
    reason    : appointment.reason,
    status    : appointment.status,
    createdAt : appointment.registeredAt.toISOString(),
    updatedAt : appointment.updatedAt.toISOString(),
    room      : appointment.room?.name ?? '[ sala não encontrada ]',
    from      : 'STUDENT',
    professor : {
      disciplines : appointment.professor.disciplines.map((discipline) => discipline.name),
      name        : appointment.professor.user.name,
      photo       : appointment.professor.user.photo,
    }
  }))
}