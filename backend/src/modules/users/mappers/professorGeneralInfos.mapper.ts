import type { AppointmentStatus } from '@backend/generated/prisma/enums';
import type { ProfessorGeneralInfosResponse } from '@shared/types/dtos/userGeneralInfos.dto';

type ProfessorGeneralInfos = {
  disciplines: {
    name: string;
  }[];
  user: {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
  appointments: {
    student: {
      user: {
        id   : number;
        name : string;
      };
    };
    id: number;
    reason: string;
    registeredAt: Date,
    updatedAt: Date,
    dateTime: Date;
    status: AppointmentStatus;
    room: {
      name: string;
    } | null;
  }[];
};

export const professorGeneralInfosMapper = (
  professor: ProfessorGeneralInfos
): ProfessorGeneralInfosResponse => {

  const statusToBeSolicitation: AppointmentStatus[] = [
    'PENDING', 'CONFIRMED', 'ACCEPTED', 'CANCELED', 'REJECTED'
  ];

  const statusToBeAppointment: AppointmentStatus[] = [
    'ACCEPTED', 'CONFIRMED'
  ];

  return {
    id           : professor.user.id,
    name         : professor.user.name,
    email        : professor.user.email,
    photo        : professor.user.photo ?? '',
    role         : 'PROFESSOR',
    registeredAt : professor.user.createdAt.toISOString(),
    disciplines  : professor.disciplines.map((discipline) => discipline.name),

    appointments : professor.appointments.filter(
      (appointment) => statusToBeAppointment.includes(appointment.status)
    ).map((appointment) => ({
      dateTime  : appointment.dateTime.toISOString(),
      createdAt : appointment.registeredAt.toISOString(),
      updatedAt : appointment.updatedAt.toISOString(),
      from      : 'PROFESSOR',
      id        : appointment.id,
      reason    : appointment.reason,
      room      : appointment.room?.name ?? null,
      status    : appointment.status,
      student : {
        name  : appointment.student.user.name,
        photo : null,
      }
    })), 

    solicitations : professor.appointments.filter(
      (appointment) => statusToBeSolicitation.includes(appointment.status)
    ).map((appointment) => ({
      dateTime  : appointment.dateTime.toISOString(),
      createdAt : appointment.registeredAt.toISOString(),
      updatedAt : appointment.updatedAt.toISOString(),
      from      : 'PROFESSOR',
      id        : appointment.id,
      reason    : appointment.reason,
      room      : appointment.room?.name ?? null,
      status    : appointment.status,
      student : {
        id    : appointment.student.user.id,
        name  : appointment.student.user.name,
        photo : null,
      }
    })), 
  };
};