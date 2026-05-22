import { Appointment } from "../appointment.type";
import { Student, Professor, Manager } from "../userBasicInfos.type";

export type StudentGeneralInfosResponse = Student & {
  appointmentsList  : Appointment<Pick<Professor  , 'name'>>[];
  role : 'STUDENT';
};

export type ProfessorGeneralInfosResponse = Professor & {
  appointmentsList  : Appointment<Pick<Student  , 'name'>>[];
  role : 'PROFESSOR';
};

export type ManagerGeneralInfosResponse = Manager & { role : 'MANAGER' };

export type UserGeneralInfosResponse = 
| StudentGeneralInfosResponse   
| ProfessorGeneralInfosResponse  
| ManagerGeneralInfosResponse   
;