import { Discipline } from "./disciplines.type";

export type RegisterUser = {
  name     : string;
  email    : string;
  password : string;
};

export type RegisterStudent = RegisterUser & {
  role : 'STUDENT';
  ra   : string;
};

export type RegisterProfessor = RegisterUser & {
  role : 'PROFESSOR';
  disciplines: Pick<Discipline, 'name'>[];
};

export type RegisterManager = RegisterUser & {
  role : 'MANAGER';
};