import { AppointmentStatus } from "@backend/generated/prisma/enums";
import { SolicitationDecision } from "../solicitationDecision.type";

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
  from      : 'STUDENT';
  updatedAt : string;
  createdAt : string;
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
  from     : 'PROFESSOR';
  updatedAt : string;
  createdAt : string;
  student  : {
    name  : string;
    photo : string | null;
  };
};

export type UserAppointmentSolicitationResponse =
| StudentAppointmentSolicitationResponse   
| ProfessorAppointmentSolicitationResponse
;
