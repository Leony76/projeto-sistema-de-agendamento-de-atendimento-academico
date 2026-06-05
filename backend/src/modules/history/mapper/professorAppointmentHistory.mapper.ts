import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { ProfessorAppointmentHistoryResponse } from "@shared/types/dtos/appointmentHistory.dto";

type MapperRequestData = {
  id: number;
  appointment: {
    id: number;
    reason: string;
    dateTime: Date;
    registeredAt: Date;
    updatedAt: Date;
    status: AppointmentStatus;
    student: {
      user: {
        name: string;
        photo: string | null;
      };
    };
  };
  room: {
    name: string;
  };
}

export const professorAppointmentsHistoryMapper = (
  data: MapperRequestData[]
): ProfessorAppointmentHistoryResponse[] => {
  return data.map(({ appointment, room, id }) => ({
    appointmentId : appointment.id,
    historyId     : id,
    dateTime : appointment.dateTime.toISOString(),
    reason   : appointment.reason,
    status   : appointment.status,
    createdAt : appointment.registeredAt.toISOString(),
    updatedAt : appointment.updatedAt.toISOString(),
    room     : room?.name ?? null,
    from     : 'PROFESSOR',
    student  : {
      name  : appointment.student.user.name,
      photo : appointment.student.user.photo,
    },
  }))
}