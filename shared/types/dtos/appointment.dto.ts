import { AppointmentStatus } from "@backend/generated/prisma/enums";
import { Appointment } from "../appointment.type";
import { Professor } from "../userBasicInfos.type";

export type StudentAppointmentResponse = {
  readonly id : number;
  reason    : string;
  dateTime  : string;
  room      : string | null;
  status    : AppointmentStatus;
  from      : 'STUDENT';
  createdAt : string;
  updatedAt : string;
  professor : {
    readonly id: number;
    name: string;
    photo: string | null;
    availableDays: string[];
    disciplines: string[];
  };
};

export type ProfessorAppointmentResponse = {
  readonly id : number;
  reason    : string;
  dateTime  : string;
  room      : string | null;
  status    : AppointmentStatus;
  from      : 'PROFESSOR'
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

export type StudentLastAppointmentResponse = 
  Appointment<Pick<Professor, 'name'>> | null;