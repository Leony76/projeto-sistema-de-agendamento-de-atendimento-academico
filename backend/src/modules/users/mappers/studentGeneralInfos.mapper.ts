import type { AppointmentStatus, AvailableDay } from "@backend/generated/prisma/enums";
import type { StudentGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";

type StudentGeneralInfos = {
  ra: string;
  user: {
    id: number;
    name: string;
    email: string;
    photo: string | null;
    createdAt: Date;
  };
  appointments: {
    id: number;
    updatedAt: Date;
    professor: {
      user: {
        name : string;
        id   : number;
      };
      disciplines: {
        name: string;
      }[];
      availability: {
        dayOfWeek: AvailableDay;
      }[];
    };
    reason: string;
    dateTime: Date;
    registeredAt: Date;
    status: AppointmentStatus;
    room: {
      name: string;
    } | null;
  }[];
};

export const studentGeneralInfosMapper = (
  student: StudentGeneralInfos
): StudentGeneralInfosResponse => {

  const statusToBeSolicitation: AppointmentStatus[] = [
    'PENDING', 'CONFIRMED', 'ACCEPTED', 'CANCELED', 'REJECTED'
  ];

  const statusToBeAppointment: AppointmentStatus[] = [
    'ACCEPTED', 'CONFIRMED'
  ];

  return {
    id           : student.user.id,
    name         : student.user.name,
    email        : student.user.email,
    photo        : student.user.photo ?? '',
    ra           : student.ra,
    role         : 'STUDENT',
    registeredAt : student.user.createdAt.toISOString(),
    
    solicitations : student.appointments.filter(
      appointment => statusToBeSolicitation.includes(appointment.status)
    ).map((appointment) => ({
      dateTime  : appointment.dateTime.toISOString(),
      createdAt : appointment.registeredAt.toISOString(),
      updatedAt : appointment.updatedAt.toISOString(),
      from      : 'STUDENT',
      id        : appointment.id,
      reason    : appointment.reason,
      room      : appointment.room?.name ?? null,
      status    : appointment.status,
      professor : {
        id            : appointment.professor.user.id,
        availableDays : appointment.professor.availability.map((available) => available.dayOfWeek),
        disciplines   : appointment.professor.disciplines.map((discipline) => discipline.name),
        name          : appointment.professor.user.name,
        photo         : null,
      }
    })),

    appointments  : student.appointments.filter(
      appointment => statusToBeAppointment.includes(appointment.status)
    ).map((appointment) => ({
      dateTime  : appointment.dateTime.toISOString(),
      createdAt : appointment.registeredAt.toISOString(),
      updatedAt : appointment.updatedAt.toISOString(),
      from      : 'STUDENT',
      id        : appointment.id,
      reason    : appointment.reason,
      room      : appointment.room?.name ?? null,
      status    : appointment.status,
      professor : {
        disciplines : appointment.professor.disciplines.map((discipline) => discipline.name),
        name        : appointment.professor.user.name,
        photo       : null,
      }
    })),
  };
};