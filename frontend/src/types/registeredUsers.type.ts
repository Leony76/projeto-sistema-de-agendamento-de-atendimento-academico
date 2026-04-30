import type { Discipline } from "./disciplines.type";

export type RegisteredStudent = {
  readonly id   : number; 
  name          : string;
  photo         : string;
  registeredAt  : string;
  appointments  : number;
  solicitations : number;
};

export type RegisteredProfessor = RegisteredStudent & {
  discipline : Discipline;
}

export type RegisteredManager = Omit<RegisteredStudent, 'appointments' | 'solicitations'>;
