import { LoginAsManagerFormData, LoginAsProfessorFormData, LoginAsStudentFormData } from "@shared/schemas/login.schema";
import { Student } from "../student.type";
import { Professor } from "../professor.type";
import { Manager } from "../manager.type";

export type LoginAsStudentRequest   = LoginAsStudentFormData;
export type LoginAsProfessorRequest = LoginAsProfessorFormData;
export type LoginAsManagerRequest   = LoginAsManagerFormData;

export type LoginAsGenericResponse = (LoginAsProfessorResponse | LoginAsManagerResponse);
export type LoginAsGenericRequest  = {
  email    : string;
  password : string;
}

export type LoginAsStudentResponse   = Student   & { role: 'STUDENT' };
export type LoginAsProfessorResponse = Professor & { role : 'PROFESSOR'};
export type LoginAsManagerResponse   = Manager   & { role : 'MANAGER' };

export type LoginResponse<T> = {
  user  : T
  token : string;
};