import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type StudentAppointmentHistoryResponse = {
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

export type ProfessorAppointmentHistoryResponse = {
  id       : number;
  reason   : string;
  dateTime : string;
  status   : AppointmentStatus;
  room     : string;
  from     : 'PROFESSOR'
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentHistoryResponse =
| StudentAppointmentHistoryResponse   
| ProfessorAppointmentHistoryResponse
;
