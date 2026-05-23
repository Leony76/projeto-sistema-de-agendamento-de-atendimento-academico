import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type StudentAppointmentResponse = {
  id        : number;
  reason    : string;
  dateTime  : string;
  room      : string;
  status    : AppointmentStatus;
  from      : 'STUDENT'
  professor : {
    name        : string;
    photo       : string | null;
    disciplines : string[];
  };
};

export type ProfessorAppointmentResponse = {
  id       : number;
  reason   : string;
  dateTime : string;
  room     : string;
  status   : AppointmentStatus;
  from     : 'PROFESSOR'
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentResponse =
| StudentAppointmentResponse   
| ProfessorAppointmentResponse
;
