import type { AppointmentStatus, AvailableDay } from "@backend/generated/prisma/enums";
import type { StudentAppointmentResponse } from "@shared/types/dtos/appointment.dto";

type MapperRequestData = {
  id: number;
  reason: string;
  dateTime: Date;
  registeredAt: Date;
  updatedAt: Date;
  status: AppointmentStatus;
  room: {
    name: string;
  } | null;
  professor: {
    user: {
      id: number;
      name: string;
      photo: string | null;
    };
    disciplines: {
      name: string;
    }[];
    availability: {
      dayOfWeek: AvailableDay;
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
      id            : appointment.professor.user.id,
      availableDays : appointment.professor.availability.map((available) => available.dayOfWeek), 
      name          : appointment.professor.user.name,
      photo         : appointment.professor.user.photo,
      disciplines   : appointment.professor.disciplines.map((discipline) => discipline.name),
    },
  }));
}