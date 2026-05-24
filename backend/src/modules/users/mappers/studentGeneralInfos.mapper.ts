import type { AppointmentStatus } from "@backend/generated/prisma/enums";
import type { StudentGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";

type StudentGeneralInfos = {
  user: {
    name: string;
    id: number;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
  ra: string;
  appointments: {
    id: number;
    reason: string;
    dateTime: Date;
    status: AppointmentStatus;
    room: {
      name: string;
    } | null;
    professor: {
      user: {
        name: string;
      };
      disciplines: {
        name: string;
      }[];
    };
  }[];
};

export const studentGeneralInfosMapper = (
  student: StudentGeneralInfos
): StudentGeneralInfosResponse => {
  return {
    id           : student.user.id,
    name         : student.user.name,
    email        : student.user.email,
    photo        : student.user.photo ?? '',
    ra           : student.ra,
    role         : 'STUDENT',
    registeredAt : student.user.createdAt.toISOString(),
    appointments: student.appointments.map((appointment) => ({
      dateTime: appointment.dateTime.toISOString(),
      from: 'STUDENT',
      id: appointment.id,
      reason: appointment.reason,
      room: appointment.room?.name ?? '[ Sala não encontrada]',
      status: appointment.status,
      professor: {
        disciplines : appointment.professor.disciplines.map((discipline) => discipline.name),
        name        : appointment.professor.user.name,
        photo       : null,
      }
    }))
  };
};