import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { ProfessorAppointmentSolicitationResponse } from "@shared/types/dtos/appointmentSolicitation.dto";

type MapperRequest = {
  id: number;
  reason: string;
  dateTime: Date;
  registeredAt: Date;
  updatedAt: Date;
  status: AppointmentStatus;
  student: {
    user: {
      id: number;
      name: string;
      photo: string | null;
    };
  };
}

export const professorSolicitationsMapper = (
  solicitations: MapperRequest[]
): ProfessorAppointmentSolicitationResponse[] => {
  return solicitations.map((solicitation) => ({
    id       : solicitation.id,
    dateTime : solicitation.dateTime.toISOString(),
    reason   : solicitation.reason,
    status   : solicitation.status,
    createdAt: solicitation.registeredAt.toISOString(),
    updatedAt: solicitation.updatedAt.toISOString(),
    from     : 'PROFESSOR',
    student : {
      id    : solicitation.student.user.id,
      name  : solicitation.student.user.name,
      photo : solicitation.student.user.photo,
    },
  }))
};