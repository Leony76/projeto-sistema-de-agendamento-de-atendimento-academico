import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type StudentAppointmentHistoryResponse = {
  readonly id        : number;
  reason    : string;
  dateTime  : string;
  room      : string | null;
  status    : AppointmentStatus;
  from      : 'STUDENT';
  updatedAt : string;
  createdAt : string;
  professor : {
    name        : string;
    photo       : string | null;
    disciplines : string[];
  };
};

export type ProfessorAppointmentHistoryResponse = {
  readonly id       : number;
  reason   : string;
  dateTime : string;
  status   : AppointmentStatus;
  room     : string | null;
  from     : 'PROFESSOR';
  updatedAt : string;
  createdAt : string;
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentHistoryResponse =
| StudentAppointmentHistoryResponse   
| ProfessorAppointmentHistoryResponse
;
