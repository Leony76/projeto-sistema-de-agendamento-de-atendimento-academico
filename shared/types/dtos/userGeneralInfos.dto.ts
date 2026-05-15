import { Appointment } from "../appointment.type";
import { Solicitation } from "../solicitation.type";
import { Student, Professor, Manager } from "../userBasicInfos.type";

export type StudentGeneralInfosResponse = Student & {
  appointmentsList  : Appointment<Pick<Professor  , 'name' | 'photo'>>[];
  solicitationsList : Solicitation<Pick<Professor , 'name' | 'photo'>>[];
  role : 'STUDENT';
};

export type ProfessorGeneralInfosResponse = Professor & {
  appointmentsList  : Appointment<Pick<Student  , 'name' | 'photo'>>[];
  solicitationsList : Solicitation<Pick<Student , 'name' | 'photo'>>[];
  role : 'PROFESSOR';
};

export type ManagerGeneralInfosResponse = Manager & { role : 'MANAGER' };

export type UserGeneralInfosResponse = 
| StudentGeneralInfosResponse   
| ProfessorGeneralInfosResponse  
| ManagerGeneralInfosResponse   
;