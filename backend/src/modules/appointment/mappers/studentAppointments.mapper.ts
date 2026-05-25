import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentAppointmentResponse } from "@shared/types/dtos/appointment.dto";

type MapperRequestData = {
  id: number;
  reason   : string;
  dateTime : Date;
  status   : AppointmentStatus;
  registeredAt: Date;
  updatedAt: Date;
  room: {
    name: string;
  } | null;
  professor: {
    user: {
      name: string;
      photo: string | null;
    };
    disciplines: {
      name: string;
    }[];
  };
}

export const studentAppointmentsMapper = (
  appointments: MapperRequestData[],
): StudentAppointmentResponse[] => {
  return appointments.map((appointment) => ({
    id       : appointment.id,
    reason   : appointment.reason,
    dateTime : appointment.dateTime.toISOString(),
    status   : appointment.status,
    createdAt: appointment.registeredAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    room     : appointment.room?.name ?? null,
    from     : 'STUDENT',
    professor : {
      name        : appointment.professor.user.name,
      photo       : appointment.professor.user.photo,
      disciplines : appointment.professor.disciplines.map((discipline) => discipline.name),
    },
  }));
}