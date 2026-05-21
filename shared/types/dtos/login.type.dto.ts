import { LoginAsManagerFormData, LoginAsProfessorFormData, LoginAsStudentFormData } from "@shared/schemas/login.schema";
import { Student, Professor, Manager } from "../userBasicInfos.type";

export type LoginAsStudentRequest   = LoginAsStudentFormData;
export type LoginAsProfessorRequest = LoginAsProfessorFormData;
export type LoginAsManagerRequest   = LoginAsManagerFormData;

export type LoginAsGenericResponse = (LoginAsProfessorResponse | LoginAsManagerResponse);
export type LoginAsGenericRequest  = {
  email    : string;
  password : string;
}

export type LoginAsStudentResponse  = Student   & { 
  role: 'STUDENT' 
  hasTemporaryPassword: boolean;
};
export type LoginAsProfessorResponse = Professor & { 
  role : 'PROFESSOR'
  hasTemporaryPassword: boolean;
};
export type LoginAsManagerResponse   = Manager   & { 
  role : 'MANAGER' 
  hasTemporaryPassword: boolean;
};

export type LoginResponse<T> = {
  user  : T
  token : string;
};