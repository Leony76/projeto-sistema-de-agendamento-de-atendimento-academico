import type { StudentGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";

type StudentAppointment = {
  id: number;
  reason: string;
  dateTime: Date;
  room: {
    name: string;
  };
  professor: {
    user: {
      name: string;
      photo: string | null;
    };
  };
};

export const studentAppointmentMapper = (
  appointment: StudentAppointment
) => {

  return {
    id       : appointment.id,
    reason   : appointment.reason,
    room     : appointment.room.name,
    dateTime : appointment.dateTime.toISOString(),

    user: {
      name  : appointment.professor.user.name,
      photo : appointment.professor.user.photo,
    },
  };
};



type StudentSolicitation = {
  id: number;
  dateTime: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  appointment: {
    reason: string;
  } | null;

  professor: {
    user: {
      name: string;
      photo: string | null;
    };
  };
};



export const studentSolicitationMapper = (
  solicitation: StudentSolicitation
) => {

  return {
    id                   : solicitation.id,
    appoitmentDateTime   : solicitation.dateTime.toISOString(),
    reason               : solicitation.appointment?.reason ?? '',
    status               : solicitation.status,

    user: {
      name  : solicitation.professor.user.name,
      photo : solicitation.professor.user.photo,
    },
  };
};



type StudentInfos = {
  ra: string;
  user: {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
  appointments: any[];
  solicitations: any[];
};

export const studentGeneralInfosMapper = (
  student: StudentInfos
): StudentGeneralInfosResponse => {

  return {
    id           : student.user.id,
    name         : student.user.name,
    email        : student.user.email,
    photo        : student.user.photo ?? '',
    ra           : student.ra,

    role         : 'STUDENT',

    registeredAt :
      student.user.createdAt.toISOString(),

    appointmentsList:
      student.appointments.map(
        studentAppointmentMapper
      ),

    solicitationsList:
      student.solicitations.map(
        studentSolicitationMapper
      ),
  };
};