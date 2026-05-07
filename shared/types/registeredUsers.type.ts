import type { Discipline } from "./disciplines.type";

type RegisteredUser = {
  readonly id   : number; 
  name          : string;
  email         : string;
  photo         : string;
  registeredAt  : string;
};

export type RegisteredStudent = RegisteredUser & {
  ra            : string;
  appointments  : number;
  solicitations : number;
};

export type RegisteredProfessor = RegisteredUser & {
  appointments  : number;
  solicitations : number;
  disciplines   : Discipline[];
}

export type RegisteredManager = RegisteredUser;
