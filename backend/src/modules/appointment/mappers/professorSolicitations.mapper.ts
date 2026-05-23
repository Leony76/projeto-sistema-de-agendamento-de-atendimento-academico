import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { ProfessorAppointmentSolicitationResponse } from "@shared/types/dtos/appointmentSolicitation.dto";

type MapperRequest = {
  id: number;
  reason: string;
  dateTime: Date;
  status: AppointmentStatus;
  student: {
    user: {
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
    from     : 'PROFESSOR',
    student : {
      name        : solicitation.student.user.name,
      photo       : solicitation.student.user.photo,
    },
  }))
};