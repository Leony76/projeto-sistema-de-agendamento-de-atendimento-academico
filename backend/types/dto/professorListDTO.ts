import { ProfessorDiscipline } from "@prisma/client";

export type ProfessorListDTO = {
  name         : string;
  discipline   : ProfessorDiscipline;
  email        : string;
  registeredAt : string;
};