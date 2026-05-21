import type { ProfessorGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';
import type { SolicitationStatus } from '@shared/types/solicitationStatus.type';

type AppointmentUser = {
  name: string;
  photo: string | null;
};

type Appointment = {
  id: number;
  reason: string;
  dateTime: Date;

  room: {
    name: string;
  };
};

export const appointmentMapper = (
  appointment: Appointment,
  user: AppointmentUser,
) => {

  return {
    id       : appointment.id,
    reason   : appointment.reason,
    room     : appointment.room.name,
    dateTime : appointment.dateTime.toISOString(),

    user: {
      name  : user.name,
      photo : user.photo,
    },
  };
};



type SolicitationUser = {
  name: string;
  photo: string | null;
};

type Solicitation = {
  id: number;
  dateTime: Date;

  status: SolicitationStatus;

  appointment: {
    reason: string;
  } | null;
};

export const solicitationMapper = (
  solicitation: Solicitation,
  user: SolicitationUser,
) => {

  return {
    id                 : solicitation.id,

    appoitmentDateTime :
      solicitation.dateTime.toISOString(),

    reason :
      solicitation.appointment?.reason ?? '',

    status : solicitation.status,

    user: {
      name  : user.name,
      photo : user.photo,
    },
  };
};



type ProfessorInfos = {
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

  appointments: {
    id: number;
    reason: string;
    dateTime: Date;

    room: {
      name: string;
    };

    student: {
      user: {
        name: string;
        photo: string | null;
      };
    };
  }[];

  solicitations: {
    id: number;
    dateTime: Date;

    status: SolicitationStatus;

    appointment: {
      reason: string;
    } | null;

    student: {
      user: {
        name: string;
        photo: string | null;
      };
    };
  }[];
};

export const professorGeneralInfosMapper = (
  professor: ProfessorInfos
): ProfessorGeneralInfosResponse => {

  return {
    id            : professor.user.id,
    name          : professor.user.name,
    email         : professor.user.email,
    photo         : professor.user.photo ?? '',

    role          : 'PROFESSOR',

    registeredAt  :
      professor.user.createdAt.toISOString(),

    disciplines:
      professor.disciplines.map(
        (discipline) => discipline.name
      ),

    appointmentsList:
      professor.appointments.map((appointment) =>
        appointmentMapper(
          appointment,
          appointment.student.user,
        )
      ),

    solicitationsList:
      professor.solicitations.map((solicitation) =>
        solicitationMapper(
          solicitation,
          solicitation.student.user,
        )
      ),
  };
};