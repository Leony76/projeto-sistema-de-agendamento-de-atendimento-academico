import type { AppointmentStatus, AvailableDay } from "@backend/generated/prisma/enums";
import type { StudentAppointmentSolicitationResponse } from "@shared/types/dtos/appointmentSolicitation.dto";

type MapperRequest = {
  id: number;
  reason: string;
  dateTime: Date;
  status: AppointmentStatus;
  registeredAt: Date;
  updatedAt: Date;
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

export const studentSolicitationsMapper = (
  solicitations: MapperRequest[]
): StudentAppointmentSolicitationResponse[] => {
  return solicitations.map((solicitation) => ({
    id       : solicitation.id,
    dateTime : solicitation.dateTime.toISOString(),
    reason   : solicitation.reason,
    status   : solicitation.status,
    createdAt: solicitation.registeredAt.toISOString(),
    updatedAt: solicitation.updatedAt.toISOString(),
    from     : 'STUDENT', 
    professor : {
      id            : solicitation.professor.user.id,
      availableDays : solicitation.professor.availability.map((available) => available.dayOfWeek),
      disciplines   : solicitation.professor.disciplines.map((discipline) => discipline.name),
      name          : solicitation.professor.user.name,
      photo         : solicitation.professor.user.photo,
    },
  }))
};