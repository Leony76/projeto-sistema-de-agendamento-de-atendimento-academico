import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";

type MapperRequestData = {
  id: number;
  room: {
    name: string;
  };
  appointment: {
    id: number;
    registeredAt: Date;
    updatedAt: Date;
    reason: string;
    dateTime: Date;
    status: AppointmentStatus;
    professor: {
      user: {
        name: string;
        photo: string | null;
      };
      disciplines: {
        name: string;
      }[];
    };
  };
}

export const studentAppointmentsHistoryMapper = (
  data: MapperRequestData[]
): StudentAppointmentHistoryResponse[] => {
  return data.map(({ appointment, room, id }) => ({
    dateTime  : appointment.dateTime.toISOString(),
    appointmentId : appointment.id,
    historyId : id,
    reason    : appointment.reason,
    status    : appointment.status,
    createdAt : appointment.registeredAt.toISOString(),
    updatedAt : appointment.updatedAt.toISOString(),
    room      : room?.name ?? null,
    from      : 'STUDENT',
    professor : {
      disciplines : appointment.professor.disciplines.map((discipline) => discipline.name),
      name        : appointment.professor.user.name,
      photo       : appointment.professor.user.photo,
    }
  }))
}