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
        name: string;
      };
    };
    id: number;
    reason: string;
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

  return {
    id           : professor.user.id,
    name         : professor.user.name,
    email        : professor.user.email,
    photo        : professor.user.photo ?? '',
    role         : 'PROFESSOR',
    registeredAt : professor.user.createdAt.toISOString(),
    disciplines  : professor.disciplines.map((discipline) => discipline.name),
    appointments : professor.appointments.map((appointment) => ({
      dateTime: appointment.dateTime.toISOString(),
      from: 'PROFESSOR',
      id: appointment.id,
      reason: appointment.reason,
      room: appointment.room?.name ?? '[ Sala não encontrada ]',
      status: appointment.status,
      student: {
        name: appointment.student.user.name,
        photo: null,
      }
    })), 
  };
};