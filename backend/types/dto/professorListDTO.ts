import { ProfessorDiscipline } from "@prisma/client";

export type ProfessorListDTO = {
  id           : number;
  name         : string;
  discipline   : ProfessorDiscipline;
  email        : string;
  registeredAt : string;
};