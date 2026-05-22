import { AppointmentStatus } from "@backend/generated/prisma/enums";

export type AppointmentSolicitationRequest = {
  readonly studentId   : number;
  readonly professorId : number
  reason    : string;
  dateTime  : string;
}
export type AppointmentSolicitationResponse = {
  reason        : string;
  dateTime      : string;
  professorName : string;
}

export type StudentAppointmentSolicitationResponse = {
  id        : number;
  reason    : string;
  dateTime  : string;
  status    : AppointmentStatus;
  professor : {
    name        : string;
    photo       : string | null;
    disciplines : string[];
  };
};

export type ProfessorAppointmentSolicitationResponse = {
  id       : number;
  reason   : string;
  dateTime : string;
  status   : AppointmentStatus;
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentSolicitationResponse =
| StudentAppointmentSolicitationResponse
| ProfessorAppointmentSolicitationResponse
;