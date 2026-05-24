import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type StudentAppointmentResponse = {
  readonly id : number;
  reason    : string;
  dateTime  : string;
  room      : string;
  status    : AppointmentStatus;
  from      : 'STUDENT';
  createdAt : string;
  updatedAt : string;
  professor : {
    name        : string;
    photo       : string | null;
    disciplines : string[];
  };
};

export type ProfessorAppointmentResponse = {
  readonly id : number;
  reason   : string;
  dateTime : string;
  room     : string;
  status   : AppointmentStatus;
  from     : 'PROFESSOR'
  createdAt : string;
  updatedAt : string;
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentResponse =
| StudentAppointmentResponse   
| ProfessorAppointmentResponse
;
