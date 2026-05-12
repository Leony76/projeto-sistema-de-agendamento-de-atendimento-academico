import { Manager } from "./manager.type";
import { Professor } from "./professor.type";
import { Student } from "./student.type"

export type RegisterAsStudentResponse = Student & {
  role: 'STUDENT';
};

export type RegisterAsManagerResponse = Manager & {
  role: 'MANAGER';
};

export type RegisterAsProfessorResponse = Professor & { 
  role: 'PROFESSOR';
  disciplines : string[]; 
};



