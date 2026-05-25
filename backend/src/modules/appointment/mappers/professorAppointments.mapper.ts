import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { ProfessorAppointmentResponse } from "@shared/types/dtos/appointment.dto";

type MapperRequestData = {
  id       : number;
  reason   : string;
  dateTime : Date;
  status   : AppointmentStatus;
  registeredAt: Date;
  updatedAt: Date;
  student : {
    user : {
      name  : string;
      photo : string | null;
    };
  };
  room : {
    name : string;
  } | null;
}

export const professorAppointmentsMapper = (
  appointments: MapperRequestData[],
): ProfessorAppointmentResponse[] => {
  return appointments.map((appointment) => ({
    id       : appointment.id,
    reason   : appointment.reason,
    status   : appointment.status,
    dateTime : appointment.dateTime.toISOString(),
    createdAt: appointment.registeredAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    room     : appointment.room?.name ?? null,
    from     : 'PROFESSOR',
    student : {
      name        : appointment.student.user.name,
      photo       : appointment.student.user.photo,
    },
  }));
}