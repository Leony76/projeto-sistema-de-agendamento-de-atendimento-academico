import type { StudentGeneralInfosResponse } from "@shared/types/dtos/userGeneralInfos.dto";
import { userAppointmentMapper, type UserAppointment } from "./userAppointment.mapper";

type StudentAppointment = Omit<UserAppointment, 'entity'> & {
  professor : {
    user : {
      name  : string;
    };
  };
};

type StudentGeneralInfos = {
  ra: string;
  user: {
    id        : number;
    name      : string;
    email     : string;
    photo     : string | null;
    createdAt : Date;
  };
  appointments  : StudentAppointment[];
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

    appointmentsList:
      student.appointments.map((appointment) =>
        userAppointmentMapper({
          ...appointment,
          entity: appointment.professor,
      })
    ),
  };
};