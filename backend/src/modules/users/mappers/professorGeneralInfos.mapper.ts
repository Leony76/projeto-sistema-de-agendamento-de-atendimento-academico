import type { ProfessorGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';
import { userAppointmentMapper, type UserAppointment } from './userAppointment.mapper';
import { userSolicitationMapper, type UserSolicitation } from './userSolicitation.mapper';

type ProfessorAppointment = Omit<UserAppointment, 'entity'> & {
  student : {
    user : {
      name  : string;
      photo : string | null;
    };
  };
};

type ProfessorSolicitation = Omit<UserSolicitation, 'entity'> & {
  student : {
    user : {
      name  : string;
      photo : string | null;
    };
  };
};

type ProfessorGeneralInfos = {
  user: {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
  disciplines: {
    name: string;
  }[];
  appointments  : ProfessorAppointment[];
  solicitations : ProfessorSolicitation[];
};

export const professorGeneralInfosMapper = (
  professor: ProfessorGeneralInfos
): ProfessorGeneralInfosResponse => {

  return {
    id           : professor.user.id,
    name         : professor.user.name,
    email        : professor.user.email,
    photo        : professor.user.photo ?? '',
    role         : 'PROFESSOR',
    registeredAt : professor.user.createdAt.toISOString(),
    disciplines:
      professor.disciplines.map(
        (discipline) => discipline.name
      ),
    appointmentsList:
      professor.appointments.map((appointment) =>
        userAppointmentMapper({
          ...appointment,
          entity: appointment.student,
      })
    ),

    solicitationsList:
       professor.solicitations.map((solicitation) =>
        userSolicitationMapper({
          ...solicitation,
          entity: solicitation.student,
      })
    ),
  };
};