import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { ProfessorAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";

type MapperRequestData = {
  appointment: {
    id       : number;
    reason   : string;
    status   : AppointmentStatus;
    dateTime : Date;
    registeredAt : Date,
    updatedAt : Date,
    room: {
      name: string;
    } | null;
    student : {
      user    : {
        name  : string;
        photo : string | null;
      };
    };
  };
}

export const professorAppointmentsHistoryMapper = (
  data: MapperRequestData[]
): ProfessorAppointmentHistoryResponse[] => {
  return data.map(({ appointment }) => ({
    dateTime : appointment.dateTime.toISOString(),
    id       : appointment.id,
    reason   : appointment.reason,
    status   : appointment.status,
    createdAt : appointment.registeredAt.toISOString(),
    updatedAt : appointment.updatedAt.toISOString(),
    room     : appointment.room?.name ?? null,
    from     : 'PROFESSOR',
    student  : {
      name  : appointment.student.user.name,
      photo : appointment.student.user.photo,
    },
  }))
}