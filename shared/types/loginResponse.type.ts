import { Manager } from "./manager.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type";

export type LoginAsStudentResponse = Student & {
  role: 'STUDENT';
};

export type LoginAsProfessorResponse = Professor & { 
  role: 'PROFESSOR';
  disciplines : string[]; 
};

export type LoginAsManagerResponse = Manager & {
  role: 'MANAGER';
};

export type LoginAsGenericResponse =
| LoginAsProfessorResponse
| LoginAsManagerResponse
;

export type LoginResponse<T> = {
  user: T
  token: string;
};
