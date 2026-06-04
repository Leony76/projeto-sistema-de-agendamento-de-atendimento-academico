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

export type EditAppointmentSolicitationResponse = {
  readonly appointmentId : number;
  reason                 : string;
  dateTime               : string;
};

export type StudentAppointmentSolicitationResponse = {
  readonly id        : number;
  reason    : string;
  dateTime  : string;
  status    : AppointmentStatus;
  from      : 'STUDENT';
  updatedAt : string;
  createdAt : string;
  professor : {
    readonly id   : number;
    name          : string;
    photo         : string | null;
    availableDays : string[];
    disciplines   : string[];
  };
};

export type ProfessorAppointmentSolicitationResponse = {
  readonly id       : number;
  reason   : string;
  dateTime : string;
  status   : AppointmentStatus;
  from     : 'PROFESSOR';
  updatedAt : string;
  createdAt : string;
  student  : {
    readonly id : number;
    name        : string;
    photo       : string | null;
  };
};

export type UserAppointmentSolicitationResponse =
| StudentAppointmentSolicitationResponse   
| ProfessorAppointmentSolicitationResponse
;
