import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentAppointmentSolicitationResponse } from "@shared/types/dtos/appointmentSolicitation.dto";

type MapperRequest = {
  id: number;
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
}

export const studentSolicitationsMapper = (
  solicitations: MapperRequest[]
): StudentAppointmentSolicitationResponse[] => {
  return solicitations.map((solicitation) => ({
    id       : solicitation.id,
    dateTime : solicitation.dateTime.toISOString(),
    reason   : solicitation.reason,
    status   : solicitation.status,
    professor : {
      disciplines : solicitation.professor.disciplines.map((discipline) => discipline.name),
      name        : solicitation.professor.user.name,
      photo       : solicitation.professor.user.photo,
    },
  }))
};