import { AppointmentStatus } from "@backend/generated/prisma/enums";
import { Student, Professor, Manager } from "../userBasicInfos.type";
import { ProfessorAppointmentResponse, StudentAppointmentResponse } from "./appointment.dto";
import { ProfessorAppointmentSolicitationResponse, StudentAppointmentSolicitationResponse } from "./appointmentSolicitation.dto";

export type StudentGeneralInfosResponse = Student & {
  appointments  : StudentAppointmentResponse[];
  solicitations : StudentAppointmentSolicitationResponse[];
  role          : 'STUDENT';
};

export type ProfessorGeneralInfosResponse = Professor & {
  appointments  : ProfessorAppointmentResponse[];
  solicitations : ProfessorAppointmentSolicitationResponse[];
  role          : 'PROFESSOR';
};

export type ManagerGeneralInfosResponse = Manager & { 
  role : 'MANAGER' 
};

export type UserGeneralInfosResponse = 
| StudentGeneralInfosResponse   
| ProfessorGeneralInfosResponse  
| ManagerGeneralInfosResponse   
;