import { ProfessorDisciplinesMap } from "../../maps/professorDisciplinesMap";

export type ProfessorListDTO = {
  name         : string;
  email        : string;
  discipline   : ProfessorDisciplinesMap;
  registeredAt : string;
}