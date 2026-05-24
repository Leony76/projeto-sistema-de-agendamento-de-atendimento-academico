import { AppointmentStatus } from "@backend/generated/prisma/enums";
import { Student, Professor, Manager } from "../userBasicInfos.type";
import { ProfessorAppointmentResponse, StudentAppointmentResponse } from "./appointment.dto";

export type StudentGeneralInfosResponse = Student & {
  appointments : StudentAppointmentResponse[];
  role : 'STUDENT';
};

export type ProfessorGeneralInfosResponse = Professor & {
  appointments : ProfessorAppointmentResponse[];
  role : 'PROFESSOR';
};

export type ManagerGeneralInfosResponse = Manager & { 
  role : 'MANAGER' 
};

export type UserGeneralInfosResponse = 
| StudentGeneralInfosResponse   
| ProfessorGeneralInfosResponse  
| ManagerGeneralInfosResponse   
;