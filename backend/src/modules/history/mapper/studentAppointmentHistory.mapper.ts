import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";

type MapperRequestData = {
  appointment: {
    id: number;
    reason: string;
    status: AppointmentStatus;
    dateTime: Date;
    registeredAt: Date;
    updatedAt: Date;
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
  room: {
    name: string;
  };
}

export const studentAppointmentsHistoryMapper = (
  data: MapperRequestData[]
): StudentAppointmentHistoryResponse[] => {
  return data.map(({ appointment, room }) => ({
    dateTime  : appointment.dateTime.toISOString(),
    id        : appointment.id,
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